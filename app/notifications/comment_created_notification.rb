# frozen_string_literal: true

class CommentCreatedNotification < ApplicationNotification
  deliver_by :database, if: :web_notification_enabled?
  deliver_by :mixin_bot, class: 'DeliveryMethods::MixinBot', category: 'APP_CARD', if: :mixin_bot_notification_enabled?

  before_mixin_bot :set_locale

  param :comment

  def data
    {
      icon_url: PRSDIGG_ICON_URL,
      title: params[:comment].commentable.title.truncate(36),
      description: description,
      action: url
    }
  end

  def description
    [params[:comment].author.name, t('.commented')].join(' ')
  end

  def message
    [params[:comment].author.name, t('.commented'), params[:comment].commentable.title].join(' ')
  end

  def url
    format(
      '%<host>s/articles/%<article_uuid>s#comment-%<comment_id>s',
      host: Rails.application.credentials.fetch(:host),
      article_uuid: params[:comment].commentable.uuid,
      comment_id: params[:comment].id
    )
  end

  def web_notification_enabled?
    recipient.notification_setting.comment_created_web
  end

  def mixin_bot_notification_enabled?
    recipient.notification_setting.comment_created_mixin_bot
  end

  def set_locale
    I18n.locale = recipient.locale if recipient.locale.present?
  end
end
