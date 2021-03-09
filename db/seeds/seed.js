const {
  topicData,
  articleData,
  commentData,
  userData
} = require('../data/index.js');
const {
  modifyTimeStamp,
  creatRefObj,
  formatItems
} = require('../utils/data-manipulation');

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
    .then(() => {
      const formattedArticles = modifyTimeStamp(articleData);
      return knex('articles').insert(formattedArticles).returning('*');
    })
    .then((seededArticles) => {
      const referenceArticles = creatRefObj(
        seededArticles,
        'title',
        'article_id'
      );
      const formattedComments = formatItems(
        commentData,
        'belongs_to',
        'article_id',
        referenceArticles
      );
      const commentsWithNewTimeStamp = modifyTimeStamp(formattedComments);
      const lastFormatComments = formatItems(
        commentsWithNewTimeStamp,
        'created_by',
        'author'
      );
      return knex('comments').insert(lastFormatComments);
    });
};
