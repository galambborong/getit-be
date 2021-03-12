const topicsRouter = require('express').Router();
const { getTopics } = require('../controllers/topics');
const { err405 } = require('../errors');

topicsRouter.route('/').get(getTopics).all(err405);

module.exports = topicsRouter;
