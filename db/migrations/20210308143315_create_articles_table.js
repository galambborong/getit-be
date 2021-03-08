exports.up = function (knex) {
  console.log('Creating articles table');
  return knex.schema.createTable('articles', (articlesTable) => {
    articlesTable.integer('article_id').primary();
    articlesTable.string('title').notNullable();
    articlesTable.string('body').notNullable();
    articlesTable.integer('votes').notNullable();
    articlesTable.string('topic').references('topics.slug');
    articlesTable.string('author').references('users.username');
    articlesTable.datetime('created_at');
  });
};

exports.down = function (knex) {
  console.log('Dropping articles table');
  return knex.schema.dropTable('articles');
};
