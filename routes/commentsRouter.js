const commentsRouter = require('express').Router();

const {
  patchCommentById,
  deleteCommentById
} = require('../controllers/comments');
const { err405 } = require('../errors');

commentsRouter
  .route('/:comment_id')
  .patch(patchCommentById)
  .delete(deleteCommentById)
  .all(err405);

module.exports = commentsRouter;
