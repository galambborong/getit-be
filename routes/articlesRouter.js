const articlesRouter = require('express').Router();
const { deleteArticleById } = require('../controllers/articles');

articlesRouter.route('/:article_id').delete(deleteArticleById);

module.exports = articlesRouter;
