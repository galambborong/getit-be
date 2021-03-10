const usersRouter = require('express').Router();
const { getUserByUsername } = require('../controllers/users');
const { err405 } = require('../errors');

usersRouter.route('/:username').get(getUserByUsername).all(err405);

module.exports = usersRouter;
