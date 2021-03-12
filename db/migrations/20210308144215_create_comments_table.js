exports.up = function (knex) {
  return knex.schema.createTable('comments', (commentsTable) => {
    commentsTable.increments('comment_id').primary();
    commentsTable.string('author').references('users.username').notNullable();
    commentsTable
      .integer('article_id')
      .references('articles.article_id')
      .onDelete('CASCADE')
      .notNullable();
    commentsTable.integer('votes').defaultTo(0);
    commentsTable.timestamp('created_at').notNullable();
    commentsTable.text('body').notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('comments');
};
