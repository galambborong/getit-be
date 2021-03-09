const topicsRouter = require('express').Router();
const {getTopics} = require('../controllers/topicsCont')

topicsRouter.route('/').get(getTopics);

module.exports = topicsRouter;