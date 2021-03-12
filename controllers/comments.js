const {
  createCommentByArticleId,
  fetchCommentsByArticleId
} = require('../models/comments');

const { checkArticleExists } = require('../models/articles');

exports.postCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;
  createCommentByArticleId(article_id, username, body)
    .then(([postedComment]) => {
      res.status(201).send({ comment: postedComment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  Promise.all([
    fetchCommentsByArticleId(article_id, req.query),
    checkArticleExists(article_id)
  ])
    .then(([comments]) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};
