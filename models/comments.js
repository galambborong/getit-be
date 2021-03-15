const connection = require('../db/connection');

exports.createCommentByArticleId = (articleId, username, body) => {
  if (username === undefined || body === undefined) {
    return Promise.reject({ status: 400, msg: 'Invalid comment properties' });
  }
  const comment = {
    author: username,
    body: body,
    article_id: articleId
  };
  return connection('comments')
    .insert(comment)
    .returning('*')
    .then(([createdComment]) => {
      return createdComment;
    });
};

exports.fetchCommentsByArticleId = (articleId, { sort_by, order }) => {
  if (sort_by === 'author' && order === undefined) order = 'asc';
  return connection
    .select('comment_id', 'votes', 'created_at', 'author', 'body')
    .from('comments')
    .where('article_id', articleId)
    .orderBy(sort_by || 'created_at', order || 'desc');
};

exports.updateCommentById = (commentId, { inc_votes }) => {
  if (!inc_votes)
    return Promise.reject({ status: 400, msg: 'Votes update not recognised' });
  return connection('comments')
    .where('comment_id', commentId)
    .increment('votes', inc_votes)
    .returning('*')
    .then(([comment]) => {
      if (comment) return comment;
      else return Promise.reject({ status: 404, msg: 'Comment not found' });
    });
};

exports.removeCommentById = (commentId) => {
  return connection('comments')
    .where('comment_id', commentId)
    .del()
    .then((deleteCount) => {
      if (deleteCount === 0)
        return Promise.reject({ status: 404, msg: 'Comment not found' });
    });
};
