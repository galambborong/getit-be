const articlesRouter = require('express').Router();
const {
  deleteArticleById,
  patchArticleById
} = require('../controllers/articles');

articlesRouter
  .route('/:article_id')
  .delete(deleteArticleById)
  .patch(patchArticleById);

module.exports = articlesRouter;
