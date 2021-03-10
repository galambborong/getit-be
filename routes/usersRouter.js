const usersRouter = require('express').Router();
const { getUserByUsername } = require('../controllers/users');
const { err405 } = require('../errors');

usersRouter.route('/:username').get(getUserByUsername).delete(err405);

module.exports = usersRouter;
