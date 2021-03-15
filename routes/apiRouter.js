const apiRouter = require('express').Router();
const { getApiEndpoints } = require('../controllers/api');
const topicsRouter = require('./topicsRouter');
const usersRouter = require('./usersRouter');
const articlesRouter = require('./articlesRouter');
const commentsRouter = require('./commentsRouter');
const { err405 } = require('../errors');

apiRouter.route('/').get(getApiEndpoints).all(err405);
apiRouter.use('/topics', topicsRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/articles', articlesRouter);
apiRouter.use('/comments', commentsRouter);

module.exports = apiRouter;
