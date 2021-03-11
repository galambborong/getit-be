const connection = require('../db/connection');

const { modifyTimeStamp } = require('../db/utils/data-manipulation');

exports.deleteArticle = (articleId) => {
  return connection('articles')
    .where('article_id', articleId)
    .del()
    .then((deleteCount) => {
      if (deleteCount === 0)
        return Promise.reject({ status: 404, msg: 'Article not found' });
    });
};

exports.updateArticleById = (articleId, votesIncrement) => {
  if (votesIncrement === undefined) {
    return Promise.reject({ status: 400, msg: 'Invalid votes input' });
  } else {
    return connection('articles')
      .where('article_id', articleId)
      .increment('votes', votesIncrement)
      .returning('*')
      .then((article) => {
        if (!article.length) {
          return Promise.reject({ status: 404, msg: 'Article not found' });
        } else {
          return article;
        }
      });
  }
};

exports.fetchArticleById = (articleId) => {
  return connection
    .select(
      'articles.article_id',
      'articles.title',
      'articles.body',
      'articles.votes',
      'articles.topic',
      'articles.author',
      'articles.created_at'
    )
    .count('comments.comment_id as comment_count')
    .from('articles')
    .leftJoin('comments', 'articles.article_id', '=', 'comments.article_id')
    .where('articles.article_id', articleId)
    .groupBy('articles.article_id')
    .then((article) => {
      if (!article.length) {
        return Promise.reject({ status: 404, msg: 'Article not found' });
      } else {
        article[0].comment_count = Number(article[0].comment_count);
        return article;
      }
    });
};

exports.createCommentByArticleId = (articleId, username, body) => {
  if (username === undefined || body === undefined) {
    return Promise.reject({ status: 400, msg: 'Invalid comment properties' });
  }
  const temporaryComment = {
    author: username,
    body: body,
    article_id: articleId,
    created_at: Date.now()
  };
  const formattedComment = modifyTimeStamp([temporaryComment]);

  return connection('comments').insert(formattedComment).returning('*');
};

exports.fetchCommentsByArticleId = (articleId, { sort_by, order }) => {
  if (sort_by === 'author' && order === undefined) order = 'asc';
  return connection
    .select('comment_id', 'votes', 'created_at', 'author', 'body')
    .from('comments')
    .where('article_id', articleId)
    .orderBy(sort_by || 'created_at', order || 'desc');
};

exports.checkArticleExists = (articleId) => {
  return connection('articles')
    .where('article_id', articleId)
    .then((article) => {
      if (article.length === 0) {
        return Promise.reject({ status: 404, msg: 'Article not found' });
      }
    });
};

exports.fetchAllArticles = () => {
  return connection
    .select(
      'articles.article_id',
      'articles.title',
      'articles.body',
      'articles.votes',
      'articles.topic',
      'articles.author',
      'articles.created_at'
    )
    .count('comments.comment_id AS comment_count')
    .from('articles')
    .leftJoin('comments', 'articles.article_id', '=', 'comments.article_id')
    .groupBy('articles.article_id')
    .then((articles) => {
      articles.forEach((article) => {
        article.comment_count = Number(article.comment_count);
      });
      return articles;
    });
};
