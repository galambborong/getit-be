process.env.NODE_ENV = 'test';
const connection = require('../db/connection');
const request = require('supertest');
const app = require('../app');

beforeEach(() => connection.seed.run());
afterAll(() => connection.destroy());

describe('/api', () => {
  describe('/topics', () => {
    describe('GET method', () => {
      test('returns status 200 and the topics', () => {
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
        it('Successfully returns appropriate username with 200 status code', () => {
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
          it('Status 404 when passing a username which does not exist', () => {
            return request(app)
              .get('/api/users/xyz')
              .expect(404)
              .then(({ body }) => {
                expect(body.msg).toBe('User does not exist');
              });
          });
          it('Status 405 when attempting an unhandled method', () => {
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
        it('Delete article by id and return 204 status code', () => {
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
        it('Test that related comments are deleted too', () => {
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
        it('Update existing article by id and return 200 status code', () => {
          return request(app)
            .patch('/api/articles/3')
            .send({ inc_votes: 7 })
            .expect(200)
            .then(({ body }) => {
              expect(body.article.votes).toBe(7);
            });
        });
        it('Correctly handles negative values', () => {
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
      describe('GET method', () => {});
    });
  });
});
