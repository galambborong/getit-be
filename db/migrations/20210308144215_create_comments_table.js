exports.up = function (knex) {
  console.log('Creating comments table');
  return knex.schema.createTable('comments', (commentsTable) => {
    commentsTable.integer('comment_id').primary();
    commentsTable.string('author').references('users.username');
    commentsTable.integer('article_id').references('articles.article_id');
    commentsTable.integer('votes').notNullable();
    commentsTable.datetime('created_at');
    commentsTable.string('body').notNullable();
  });
};

exports.down = function (knex) {
  console.log('Dropping comments table');
  return knex.schema.dropTable('comments');
};
