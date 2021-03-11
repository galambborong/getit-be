const articlesRouter = require('express').Router();
const {
  deleteArticleById,
  patchArticleById,
  getArticleById,
  postCommentByArticleId,
  getCommentsByArticleId
} = require('../controllers/articles');
const { err405 } = require('../errors');

articlesRouter
  .route('/:article_id')
  .delete(deleteArticleById)
  .patch(patchArticleById)
  .get(getArticleById)
  .all(err405);

articlesRouter
  .route('/:article_id/comments')
  .post(postCommentByArticleId)
  .get(getCommentsByArticleId);

module.exports = articlesRouter;
