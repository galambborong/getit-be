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

exports.checkArticleExists = (articleId) => {
  return connection('articles')
    .where('article_id', articleId)
    .then((article) => {
      if (article.length === 0) {
        return Promise.reject({ status: 404, msg: 'Article not found' });
      }
    });
};

exports.fetchAllArticles = ({ sort_by, order, author, topic }) => {
  if (order !== 'asc') order = undefined;
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
    .orderBy(sort_by || 'articles.created_at', order || 'desc')
    .modify((querySoFar) => {
      if (author !== undefined) {
        querySoFar.where('articles.author', author);
      }
      if (topic !== undefined) {
        querySoFar.where('articles.topic', topic);
      }
    })
    .then((articles) => {
      articles.forEach((article) => {
        article.comment_count = Number(article.comment_count);
      });
      // console.log(articles);
      if (!articles.length)
        return Promise.reject({ status: 404, msg: 'Article not found' });
      else return articles;
    });
};

exports.createNewArticle = ({ title, topic, author, body }) => {
  if (typeof body !== 'string' || typeof title !== 'string')
    return Promise.reject({ status: 400, msg: 'Article not valid' });
  const tmpArticle = {
    author,
    body,
    topic,
    title,
    created_at: Date.now()
  };
  const formattedArticle = modifyTimeStamp([tmpArticle]);
  return connection('articles')
    .insert(formattedArticle)
    .returning('*')
    .then(([insertedArticle]) => {
      return insertedArticle;
    });
};
