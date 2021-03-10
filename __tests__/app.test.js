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
            .get('/api/users/icellusedkars')
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
          xit('Status 400 when passing invalid username', () => {
            return request(app)
              .get('/api/users/#!aa')
              .expect(400)
              .then((res) => {
                console.log(res);
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
          it('Status 400 when passed invalid article_id', () => {
            return request(app)
              .delete('/api/articles/pigeon')
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).toBe('Invalid type');
              });
          });
          it('Status 404 when passed valid id which is not present', () => {
            return request(app)
              .delete('/api/articles/301')
              .expect(404)
              .then(({ body }) => {
                expect(body.msg).toBe('Article not found');
              });
          });
        });
      });
    });
  });
});
