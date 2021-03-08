const {
  topicData,
  articleData,
  commentData,
  userData
} = require('../data/index.js');
const {modifyTimeStamp} = require('../utils/data-manipulation')

exports.seed = function (knex) {
  return knex.migrate
    .rollback()
    .then(() => knex.migrate.latest())
    .then(() => {
      return knex('users').insert(userData).returning('*');
    })
    .then(() => {
      return knex('topics').insert(topicData).returning('*');
    })
    .then(() =>  {
      const formattedArticles = modifyTimeStamp(articleData)
      return knex('articles').insert(formattedArticles).returning('*')
    })
    .then((data) => {console.log(data)})
};
