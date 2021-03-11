process.env.NODE_ENV = 'test';
const connection = require('../db/connection');
const request = require('supertest');
const app = require('../app');

beforeEach(() => connection.seed.run());
afterAll(() => connection.destroy());

describe('/api', () => {
  describe('/topics', () => {
    describe('GET method', () => {
      test('Status 200: Return all topics', () => {
        return request(app)
          .get('/api/topics')
          .expect(200)
          .then(({ body }) => {
            expect(Array.isArray(body.topics)).toBe(true);
            expect(body.topics[0]).toMatchObject({
              slug: expect.any(String),
              description: expect.any(String)
            });
          });
      });
    });
  });
  describe('/users', () => {
    describe('/:username', () => {
      describe('GET method', () => {
        it('Status 200: Reutn appropriate user from username', () => {
          return request(app)
            .get('/api/users/lurker')
            .expect(200)
            .then(({ body }) => {
              expect(body.user).toMatchObject({
                username: expect.any(String),
                avatar_url: expect.any(String),
                name: expect.any(String)
              });
            });
        });
        describe('Error handling', () => {
          it('Status 404: Username does not exist', () => {
            return request(app)
              .get('/api/users/xyz')
              .expect(404)
              .then(({ body }) => {
                expect(body.msg).toBe('User does not exist');
              });
          });
          it('Status 405: Unhandled method', () => {
            return request(app)
              .delete('/api/users/icellusedkars')
              .expect(405)
              .then(({ body }) => {
                expect(body.msg).toBe('Method not allowed');
              });
          });
        });
      });
    });
  });
  describe('/articles', () => {
    describe('/:article_id', () => {
      describe('DELETE method', () => {
        it('Status 204: Delete article by article_id', () => {
          return request(app)
            .delete('/api/articles/5')
            .expect(204)
            .then(() => {
              return connection
                .select('*')
                .from('articles')
                .where('article_id', 5);
            })
            .then((articles) => {
              expect(articles).toHaveLength(0);
            });
        });
        it('Status 204: Test related comments are deleted', () => {
          return request(app)
            .delete('/api/articles/5')
            .expect(204)
            .then(() => {
              return connection
                .select('*')
                .from('comments')
                .where('article_id', 5);
            })
            .then((comments) => {
              expect(comments).toHaveLength(0);
            });
        });
        describe('Error handling', () => {
          it('Status 400: Invalid article_id', () => {
            return request(app)
              .delete('/api/articles/pigeon')
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).toBe('Invalid type');
              });
          });
          it('Status 404: Valid id not present', () => {
            return request(app)
              .delete('/api/articles/301')
              .expect(404)
              .then(({ body }) => {
                expect(body.msg).toBe('Article not found');
              });
          });
        });
      });
      describe('PATCH method', () => {
        it('Status 200: Update existing article by id', () => {
          return request(app)
            .patch('/api/articles/3')
            .send({ inc_votes: 7 })
            .expect(200)
            .then(({ body }) => {
              expect(body.article.votes).toBe(7);
            });
        });
        it('Status 200: Correctly handles negative values', () => {
          return request(app)
            .patch('/api/articles/3')
            .send({ inc_votes: -7 })
            .expect(200)
            .then(({ body }) => {
              expect(body.article.votes).toBe(-7);
            });
        });
        describe('Error handling', () => {
          it('Status 400: Reject PATCH request when key `inc_votes` is not present', () => {
            return request(app)
              .patch('/api/articles/2')
              .send({ votes_inc: 10 })
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).toBe('Invalid votes input');
              });
          });
          it('Status 400: Reject PATCH request when votes value is invalid', () => {
            return request(app)
              .patch('/api/articles/1')
              .send({ inc_votes: 'hello' })
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).toBe('Invalid type');
              });
          });
          it('Status 400: Reject PATCH on invalid article_id', () => {
            return request(app)
              .patch('/api/articles/hello_there')
              .send({ inc_votes: 11 })
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).toBe('Invalid type');
              });
          });
          it('Status 404: Reject PATCH on valid id not present', () => {
            return request(app)
              .patch('/api/articles/350')
              .send({ inc_votes: 69 })
              .expect(404)
              .then(({ body }) => {
                expect(body.msg).toBe('Article not found');
              });
          });
        });
      });
      describe('GET method', () => {
        it('Status 200: Return specified article with expected shape', () => {
          return request(app)
            .get('/api/articles/1')
            .expect(200)
            .then(({ body }) => {
              expect(body.article).toMatchObject({
                article_id: expect.any(Number),
                title: expect.any(String),
                body: expect.any(String),
                votes: expect.any(Number),
                topic: expect.any(String),
                author: expect.any(String),
                created_at: expect.any(String),
                comment_count: expect.any(Number)
              });
            });
        });
        describe('Error handling', () => {
          it('Status 400: Invalid article_id', () => {
            return request(app)
              .get('/api/articles/a-random-id')
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).toBe('Invalid type');
              });
          });
          it('Status 404: article_id not found', () => {
            return request(app)
              .get('/api/articles/321')
              .expect(404)
              .then(({ body }) => {
                expect(body.msg).toBe('Article not found');
              });
          });
        });
      });
      describe('Disallowed methods', () => {
        it('Status 405: Unhandled methods', () => {
          return request(app)
            .post('/api/articles/5')
            .send({ data: 'garbage' })
            .expect(405)
            .then(({ body }) => {
              expect(body.msg).toBe('Method not allowed');
            });
        });
      });
      describe('/comments', () => {
        describe('POST method', () => {
          it('Status 201: Comment created', () => {
            return request(app)
              .post('/api/articles/2/comments')
              .send({
                username: 'lurker',
                body:
                  'This is an excellent article and I enjoyed it thoroughly. I would highly recommend it to EVERYONE.'
              })
              .expect(201)
              .then(({ body }) => {
                expect(body.comment).toMatchObject({
                  comment_id: expect.any(Number),
                  author: 'lurker',
                  article_id: 2,
                  votes: 0,
                  created_at: expect.any(String),
                  body:
                    'This is an excellent article and I enjoyed it thoroughly. I would highly recommend it to EVERYONE.'
                });
              });
          });
        });
      });
    });
  });
});
