const connection = require('../db/connection');

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
  return connection('articles')
    .where('article_id', articleId)
    .then((article) => {
      if (!article.length) {
        return Promise.reject({ status: 404, msg: 'Article not found' });
      } else {
        return article;
      }
    });
};
