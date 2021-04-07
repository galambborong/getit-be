const usersRouter = require('express').Router();
const { getUserByUsername, getAllUsers } = require('../controllers/users');
const { err405 } = require('../errors');

usersRouter.route('/').get(getAllUsers).all(err405);
usersRouter.route('/:username').get(getUserByUsername).all(err405);

module.exports = usersRouter;
