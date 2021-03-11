const {
  deleteArticle,
  updateArticleById,
  fetchArticleById,
  createCommentByArticleId,
  fetchCommentsByArticleId
} = require('../models/articles');

exports.deleteArticleById = (req, res, next) => {
  const { article_id } = req.params;
  deleteArticle(article_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  updateArticleById(article_id, inc_votes)
    .then(([updatedArticle]) => {
      res.status(200).send({ article: updatedArticle });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then(([receivedArticle]) => {
      res.status(200).send({ article: receivedArticle });
    })
    .catch((err) => {
      next(err);
    });
};

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
  fetchCommentsByArticleId(article_id)
    .then((receivedComments) => {
      res.status(200).send({ comments: receivedComments });
    })
    .catch((err) => {
      next(err);
    });
};
