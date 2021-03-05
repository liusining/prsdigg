# frozen_string_literal: true

# == Schema Information
#
# Table name: orders
#
#  id         :bigint           not null, primary key
#  change_btc :decimal(, )
#  change_usd :decimal(, )
#  item_type  :string
#  order_type :integer
#  state      :string
#  total      :decimal(, )
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  asset_id   :uuid
#  buyer_id   :bigint
#  item_id    :bigint
#  seller_id  :bigint
#  trace_id   :uuid
#
# Indexes
#
#  index_orders_on_asset_id               (asset_id)
#  index_orders_on_buyer_id               (buyer_id)
#  index_orders_on_item_type_and_item_id  (item_type,item_id)
#  index_orders_on_seller_id              (seller_id)
#
class Order < ApplicationRecord
  AUTHOR_RATIO = 0.5
  READER_RATIO = 0.4
  PRSDIGG_RATIO = 0.1
  MINIMUM_AMOUNT = 0.0000_0001

  include AASM

  belongs_to :buyer, class_name: 'User'
  belongs_to :seller, class_name: 'User'
  belongs_to :item, polymorphic: true, counter_cache: true
  belongs_to :payment, foreign_key: :trace_id, primary_key: :trace_id, inverse_of: :order
  belongs_to :currency, primary_key: :asset_id, foreign_key: :asset_id, inverse_of: :orders

  has_many :transfers, as: :source, dependent: :nullify

  before_validation :setup_attributes, on: :create

  # prevent duplicated buy order
  validates :order_type, uniqueness: { scope: %i[order_type buyer_id item_id item_type], if: -> { buy_article? } }
  validates :asset_id, presence: true
  validates :total, presence: true
  validates :trace_id, presence: true, uniqueness: true
  validate :ensure_total_sufficient, on: :create

  enum order_type: { buy_article: 0, reward_article: 1 }

  delegate :price_tag, to: :payment, prefix: true
  scope :only_prs, -> { where(asset_id: Currency::PRS_ASSET_ID) }
  scope :only_btc, -> { where(asset_id: Currency::BTC_ASSET_ID) }

  after_create :complete_payment, :update_item_revenue, :update_buyer_statistics_cache
  before_destroy :destroy_notifications
  after_commit :distribute_async,
               :notify_reading_subscribers,
               :notify_buyer,
               on: :create

  aasm column: :state do
    state :paid, initial: true
    state :completed

    event :complete, guard: :all_transfers_processed? do
      transitions from: :paid, to: :completed
    end
  end

  def distribute_async
    DistributeOrderWorker.perform_async trace_id
  end

  # transfer revenue to author and readers
  def distribute!
    # the share for invested readers before
    amount = total * READER_RATIO

    # payment maybe swapped
    revenue_asset_id = payment.swap_order&.fill_asset_id || payment.asset_id

    # the present orders
    _orders =
      item.orders
          .where('id < ? and created_at < ?', id, created_at)

    # total investment
    sum = _orders.sum(:total)

    # create reader transfer
    _distributed_amount = 0
    _orders.each do |_order|
      # ignore if amount is less than minium amout for Mixin Network
      _amount = (amount * _order.total / sum).round(8)
      next if (_amount - MINIMUM_AMOUNT).negative?

      transfers.create_with(
        wallet: payment.wallet,
        transfer_type: :reader_revenue,
        opponent_id: _order.buyer.mixin_uuid,
        asset_id: revenue_asset_id,
        amount: _amount.to_f.to_s,
        memo: "Reader revenue from #{item.title}".truncate(140)
      ).find_or_create_by!(
        trace_id: PrsdiggBot.api.unique_conversation_id(trace_id, _order.trace_id)
      )

      _distributed_amount += _amount
    end

    # create prsdigg transfer
    _prsdigg_amount = (total * PRSDIGG_RATIO).round(8)
    if payment.wallet.present?
      transfers.create_with(
        wallet: payment.wallet,
        transfer_type: :prsdigg_revenue,
        opponent_id: PrsdiggBot.api.client_id,
        asset_id: revenue_asset_id,
        amount: _prsdigg_amount.to_f.to_s,
        memo: "article uuid: #{item.uuid}》".truncate(140)
      ).find_or_create_by!(
        trace_id: payment.wallet.mixin_api.unique_conversation_id(trace_id, PrsdiggBot.api.client_id)
      )
    end

    # create author transfer
    transfers.create_with(
      wallet: payment.wallet,
      transfer_type: :author_revenue,
      opponent_id: item.author.mixin_uuid,
      asset_id: revenue_asset_id,
      amount: (total - _distributed_amount - _prsdigg_amount).round(8),
      memo: "#{payment.payer.name} #{buy_article? ? 'bought' : 'rewarded'} article #{item.title}".truncate(140)
    ).find_or_create_by!(
      trace_id: PrsdiggBot.api.unique_conversation_id(trace_id, item.author.mixin_uuid)
    )
  end

  def all_transfers_processed?
    transfers.unprocessed.blank?
  end

  def complete_payment
    payment.complete! if payment.paid?
  end

  def update_item_revenue
    item.update_revenue
  end

  def ensure_total_sufficient
    errors.add(:total, 'insufficient') if buy_article? && total < item.price
  end

  def notify_reading_subscribers
    if reward_article?
      ArticleRewardedNotification.with(order: self).deliver(buyer.reading_subscribe_by_users)
    elsif buy_article?
      ArticleBoughtNotification.with(order: self).deliver(buyer.reading_subscribe_by_users)
    end
  end

  def notify_buyer
    OrderCreatedNotification.with(order: self).deliver(buyer)
  end

  def article
    item if item.is_a? Article
  end

  def update_buyer_statistics_cache
    buyer.update(
      bought_articles_count: buyer.bought_articles.count,
      payment_total_prs: buyer.orders.only_prs.sum(:total).to_f,
      payment_total_btc: buyer.orders.only_btc.sum(:total).to_f
    )
  end

  def notifications
    @notifications = Notification.where(params: { order: self })
  end

  def destroy_notifications
    notifications.destroy_all
  end

  def cache_history_ticker
    r = PrsdiggBot.api.ticker asset_id, created_at.utc.rfc3339
    update change_btc: r['price_btc'].to_f * total, change_usd: r['price_usd'].to_f * total
  end

  def cache_history_ticker_async
    CacheOrderHistoryTickerWorker.perform_async id
  end

  private

  def setup_attributes
    amount =
      if payment.asset_id == item.asset_id
        payment.amount
      elsif payment.swap_order&.swapped? || payment.swap_order&.completed?
        if buy_article?
          payment.swap_order.min_amount
        elsif reward_article?
          payment.swap_order.amount
        end
      end

    self.currency = item.currency
    assign_attributes(
      buyer: payment.payer,
      seller: item.author,
      total: amount,
      change_btc: currency.price_btc.to_f * amount,
      change_usd: currency.price_usd.to_f * amount
    )
  end
end
