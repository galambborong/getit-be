const { fetchUserByUsername } = require('../models/users');

exports.getUserByUsername = (req, res, next) => {
  const { username } = req.params;
  console.log(username);
  fetchUserByUsername(username)
    .then(([returnedUser]) => {
      console.log(returnedUser);
      res.status(200).send({ user: returnedUser });
    })
    .catch((err) => {
      next(err);
    });
};
