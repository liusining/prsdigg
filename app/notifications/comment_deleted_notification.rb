# frozen_string_literal: true

class CommentDeletedNotification < ApplicationNotification
  deliver_by :database
  deliver_by :mixin_bot, class: 'DeliveryMethods::MixinBot', category: 'PLAIN_TEXT'

  before_mixin_bot :set_locale

  param :comment

  def data
    message
  end

  def message
    [params[:comment].commentable.title, t('deleted')].join(' ')
  end

  def url
    format(
      '%<host>s/articles/%<article_uuid>s#comment-%<comment_id>s',
      host: Rails.application.credentials.fetch(:host),
      article_uuid: params[:comment].commentable.uuid,
      comment_id: params[:comment].id
    )
  end

  def set_locale
    I18n.locale = recipient.locale if recipient.locale.present?
  end
end
