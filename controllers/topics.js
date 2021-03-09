const { fetchTopics } = require('../models/topics');

exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then((returnedTopics) => {
      res.status(200).send({ topics: returnedTopics });
    })
    .catch((err) => {
      next(err);
    });
};
