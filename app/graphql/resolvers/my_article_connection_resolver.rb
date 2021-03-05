# frozen_string_literal: true

module Resolvers
  class MyArticleConnectionResolver < MyBaseResolver
    argument :type, String, required: true
    argument :after, String, required: false

    type Types::ArticleConnectionType, null: false

    def resolve(params)
      case params[:type]
      when 'author'
        current_user.articles.order(created_at: :desc)
      when 'reader'
        current_user.bought_articles
      end
    end
  end
end
