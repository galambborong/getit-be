const connection = require('../db/connection');

const { modifyTimeStamp } = require('../db/utils/data-manipulation');

exports.createCommentByArticleId = (articleId, username, body) => {
  if (username === undefined || body === undefined) {
    return Promise.reject({ status: 400, msg: 'Invalid comment properties' });
  }
  const temporaryComment = {
    author: username,
    body: body,
    article_id: articleId,
    created_at: Date.now()
  };
  const formattedComment = modifyTimeStamp([temporaryComment]);

  return connection('comments').insert(formattedComment).returning('*');
};

exports.fetchCommentsByArticleId = (articleId, { sort_by, order }) => {
  if (sort_by === 'author' && order === undefined) order = 'asc';
  return connection
    .select('comment_id', 'votes', 'created_at', 'author', 'body')
    .from('comments')
    .where('article_id', articleId)
    .orderBy(sort_by || 'created_at', order || 'desc');
};
