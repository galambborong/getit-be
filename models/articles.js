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
