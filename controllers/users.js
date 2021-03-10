const { fetchUserByUsername } = require('../models/users');

exports.getUserByUsername = (req, res, next) => {
  const { username } = req.params;
  fetchUserByUsername(username)
    .then(([returnedUser]) => {
      res.status(200).send({ user: returnedUser });
    })
    .catch((err) => {
      next(err);
    });
};
