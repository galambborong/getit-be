process.env.NODE_ENV = 'test';

const connection = require('../db/connection');
const request = require('supertest');
const app = require('../app');

beforeEach(() => {
  connection.seed.run();
});
afterAll(() => {
  connection.destroy();
});

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
              console.log(body);
              // expect(body.user[0]).toMatchObject({
              //   username: expect.any(String),
              //   avatar_url: expect.any(String),
              //   name: expect.any(String)
              // });
            });
        });
      });
    });
  });
});
