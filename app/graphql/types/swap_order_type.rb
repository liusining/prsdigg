# frozen_string_literal: true

module Types
  class SwapOrderType < Types::BaseObject
    field :id, ID, null: false
    field :trace_id, ID, null: false
    field :state, String, null: false
    field :funds, Float, null: true
    field :amount, Float, null: true
    field :min_amount, Float, null: true
    field :fill_asset_id, String, null: false
    field :pay_asset_id, String, null: false

    field :payer, Types::UserType, null: false
    field :payment, Types::PaymentType, null: false
    field :article, Types::ArticleType, null: true
    field :pay_asset, Types::CurrencyType, null: false
    field :fill_asset, Types::CurrencyType, null: false

    def payer
      BatchLoader::GraphQL.for(object.payment_id).batch do |payment_ids, loader|
        Payment.includes(:payer).where(id: payment_ids).each { |payment| loader.call(payment.id, payment.payer) }
      end
    end

    def article
      BatchLoader::GraphQL.for(object.user_id).batch do |user_ids, loader|
        MixinNetworkUser.includes(:owner).where(uuid: user_ids).each { |user| loader.call(user.uuid, user.owner) if user.owner.is_a?(Article) }
      end
    end

    def payment
      BatchLoader::GraphQL.for(object.payment_id).batch do |payment_ids, loader|
        Payment.where(id: payment_ids).each { |payment| loader.call(payment.id, payment) }
      end
    end

    def pay_asset
      BatchLoader::GraphQL.for(object.pay_asset_id).batch do |asset_ids, loader|
        Currency.where(asset_id: asset_ids).each { |currency| loader.call(currency.asset_id, currency) }
      end
    end

    def fill_asset
      BatchLoader::GraphQL.for(object.fill_asset_id).batch do |asset_ids, loader|
        Currency.where(asset_id: asset_ids).each { |currency| loader.call(currency.asset_id, currency) }
      end
    end
  end
end
