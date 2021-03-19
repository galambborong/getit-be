process.env.NODE_ENV = 'test';
const connection = require('../db/connection');
const request = require('supertest');
const app = require('../app');

beforeEach(() => connection.seed.run());
afterAll(() => connection.destroy());

describe('/*', () => {
  it('Status 404: path not found', () => {
    return request(app).get('/hello').expect(404);
  });
  it('Status 404: path not found', () => {
    return request(app).get('/apy/articles').expect(404);
  });
  it('Status 404: path not found', () => {
    return request(app).get('/api/articlez').expect(404);
  });
});
describe('/api', () => {
  describe('GET method', () => {
    it('Status 200: Serves JSON summary of available endpoints', () => {
      return request(app)
        .get('/api')
        .expect(200)
        .then(({ body }) => {
          expect(body).toMatchObject({
            'GET /api': expect.any(Object),
            'GET /api/topics': expect.any(Object),
            'GET /api/articles': expect.any(Object)
          });
        });
    });
  });
  describe('Error handling', () => {
    it('Status 405: Not allowed', () => {
      return request(app)
        .delete('/api')
        .expect(405)
        .then(({ body }) => {
          expect(body.msg).toBe('Method not allowed');
        });
    });
  });
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
    describe('Methods not allowed', () => {
      it('Status 405: Method not allowed', () => {
        return request(app)
          .delete('/api/topics')
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).toBe('Method not allowed');
          });
      });
    });
  });
  describe('/users', () => {
    describe('/:username', () => {
      describe('GET method', () => {
        it('Status 200: Return appropriate user from username', () => {
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
    describe('GET method', () => {
      it('Status 200: Return all articles in expected shape', () => {
        return request(app)
          .get('/api/articles')
          .expect(200)
          .then(({ body }) => {
            expect(Array.isArray(body.articles)).toBe(true);
            expect(body.articles[0]).toMatchObject({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number)
            });
          });
      });
      it('Status 200: Default sort order by date column', () => {
        return request(app)
          .get('/api/articles')
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).toBeSortedBy('created_at', {
              descending: true
            });
          });
      });
      describe('Queries', () => {
        it('Status 200: Sorts by specified column', () => {
          return request(app)
            .get('/api/articles?sort_by=author')
            .expect(200)
            .then(({ body }) => {
              expect(body.articles).toBeSortedBy('author', {
                descending: true
              });
            });
        });
        it('Status 200: Orders articles as specified', () => {
          return request(app)
            .get('/api/articles?order=asc')
            .expect(200)
            .then(({ body }) => {
              expect(body.articles).toBeSortedBy('created_at', {
                ascending: true
              });
            });
        });
        it('Status 200: Sorts and orders articles as specified', () => {
          return request(app)
            .get('/api/articles?sort_by=author&order=asc')
            .expect(200)
            .then(({ body }) => {
              expect(body.articles).toBeSortedBy('author', {
                ascending: true
              });
            });
        });
        it('Status 200: Filter articles by author', () => {
          return request(app)
            .get('/api/articles?author=icellusedkars')
            .expect(200)
            .then(({ body }) => {
              expect(
                body.articles.every(
                  (article) => article.author === 'icellusedkars'
                )
              ).toBe(true);
            });
        });
        it('Status 200: Filter articles by topic', () => {
          return request(app)
            .get('/api/articles?topic=cats')
            .expect(200)
            .then(({ body }) => {
              expect(
                body.articles.every((article) => article.topic === 'cats')
              ).toBe(true);
            });
        });
      });
      describe('Error handling', () => {
        it('Status 200: Ignore invalid order value', () => {
          return request(app)
            .get('/api/articles?order=name')
            .expect(200)
            .then(({ body }) => {
              expect(Array.isArray(body.articles)).toBe(true);
              expect(body.articles).toBeSortedBy('created_at', {
                descending: true
              });
            });
        });
        it('Status 200: Ignore invalid query argument', () => {
          return request(app)
            .get('/api/articles?pigeon=author')
            .expect(200)
            .then(({ body }) => {
              expect(Array.isArray(body.articles)).toBe(true);
              expect(body.articles).toBeSortedBy('created_at', {
                descending: true
              });
            });
        });
        it('Status 400: Invalid sort_by value', () => {
          return request(app)
            .get('/api/articles?sort_by=age')
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toBe('Invalid type');
            });
        });
        it('Status 404: Author not found', () => {
          return request(app)
            .get('/api/articles?author=galambborong')
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).toBe('Article not found');
            });
        });
        it('Status 404: Topic not found', () => {
          return request(app)
            .get('/api/articles?topic=icecream')
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).toBe('Article not found');
            });
        });
      });
    });
    describe('POST method', () => {
      it('Status 201: Create and return new article', () => {
        return request(app)
          .post('/api/articles')
          .send({
            title: 'One massive article',
            topic: 'cats',
            author: 'rogersop',
            body:
              "This is a crazy long article about cats which I know you'll enjoy"
          })
          .expect(201)
          .then(({ body }) => {
            expect(body.article).toMatchObject({
              article_id: expect.any(Number),
              author: expect.any(String),
              body: expect.any(String),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number)
            });
          });
      });
      describe('Error handling', () => {
        it('Status 400: Incorrect article shape :: unknown columns', () => {
          return request(app)
            .post('/api/articles')
            .send({ hello: 'this', is: 'a', wrong: 'article', shape: 'true' })
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toBe('Article not valid');
            });
        });
        it('Status 400: Incomplete article :: missing columns', () => {
          return request(app)
            .post('/api/articles')
            .send({
              title: 'Hey',
              author: 'icellusedkars',
              body: 'One massive article'
            })
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toBe('Invalid type');
            });
        });
        it('Status 400: Incorrect article shape :: wrong data types', () => {
          return request(app)
            .post('/api/articles')
            .send({
              title: 1,
              topic: 'cats',
              body: true,
              author: 'rogersop'
            })
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toBe('Article not valid');
            });
        });
        it('Status 404: Data not in referenced table', () => {
          return request(app)
            .post('/api/articles')
            .send({
              title: 'Another attempt',
              author: 'galambborong',
              topic: 'mitch',
              body: 'This is an article'
            })
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).toBe('Not found');
            });
        });
      });
    });
    describe('Disallowed methods', () => {
      it('Status 405: Method not allowed', () => {
        return request(app)
          .patch('/api/articles')
          .send({ some: 'nonsense' })
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).toBe('Method not allowed');
          });
      });
    });
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
          it('Status 404: Valid id not found', () => {
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
          it('Status 201: Comment created and returned', () => {
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
          describe('Error handling', () => {
            it('Status 400: Invalid article_id', () => {
              return request(app)
                .post('/api/articles/jeff/comments')
                .send({ username: 'lurker', body: 'This will never work' })
                .expect(400)
                .then(({ body }) => {
                  expect(body.msg).toBe('Invalid type');
                });
            });
            it('Status 400: Invalid comment structure', () => {
              return request(app)
                .post('/api/articles/1/comments')
                .send({
                  a_random_key: 'An even more random value',
                  body: 'This should never work'
                })
                .expect(400)
                .then(({ body }) => {
                  expect(body.msg).toBe('Invalid comment properties');
                });
            });
            it('Status 404: article_id not found', () => {
              return request(app)
                .post('/api/articles/213/comments')
                .send({
                  username: 'icellusedkars',
                  body: 'This is an awesome comment'
                })
                .expect(404)
                .then(({ body }) => {
                  expect(body.msg).toBe('Not found');
                });
            });
            it('Status 404: username not found', () => {
              return request(app)
                .post('/api/articles/9/comments')
                .send({
                  username: 'galambborong',
                  body: 'This is a comment of much substance.'
                })
                .expect(404)
                .then(({ body }) => {
                  expect(body.msg).toBe('Not found');
                });
            });
          });
        });
        describe('GET method', () => {
          it('Status 200: Return comments in expected shape', () => {
            return request(app)
              .get('/api/articles/1/comments')
              .expect(200)
              .then(({ body }) => {
                expect(Array.isArray(body.comments)).toBe(true);
                expect(body.comments[0]).toMatchObject({
                  comment_id: expect.any(Number),
                  votes: expect.any(Number),
                  created_at: expect.any(String),
                  author: expect.any(String),
                  body: expect.any(String)
                });
              });
          });
          it('Status 200: Comments sorted by `created_at` in descending order by default', () => {
            return request(app)
              .get('/api/articles/1/comments')
              .expect(200)
              .then(({ body }) => {
                expect(body.comments).toBeSortedBy('created_at', {
                  descending: true
                });
              });
          });
          it('Status 200: article_id has no comments', () => {
            return request(app)
              .get('/api/articles/2/comments')
              .expect(200)
              .then(({ body }) => {
                expect(body.comments).toHaveLength(0);
              });
          });
          describe('Queries', () => {
            it('Status 200: Sorts by specified column', () => {
              return request(app)
                .get('/api/articles/1/comments?sort_by=author')
                .expect(200)
                .then(({ body }) => {
                  expect(body.comments).toBeSortedBy('author', {
                    ascending: true
                  });
                });
            });
            it('Status 200: Sorted column follows specified order', () => {
              return request(app)
                .get('/api/articles/1/comments?order=asc')
                .expect(200)
                .then(({ body }) => {
                  expect(body.comments).toBeSortedBy('created_at', {
                    ascending: true
                  });
                });
            });
            it('Status 200: Sorts by specified column in specified order', () => {
              return request(app)
                .get('/api/articles/1/comments?sort_by=votes&order=asc')
                .expect(200)
                .then(({ body }) => {
                  expect(body.comments).toBeSortedBy('votes', {
                    ascending: true
                  });
                });
            });
          });
          describe('Error handling', () => {
            describe('Standard request errors', () => {
              it('Status 400: Invalid article_id', () => {
                return request(app)
                  .get('/api/articles/pigeon/comments')
                  .expect(400)
                  .then(({ body }) => {
                    expect(body.msg).toBe('Invalid type');
                  });
              });
              it('Status 404: article_id not found', () => {
                return request(app)
                  .get('/api/articles/0/comments')
                  .expect(404)
                  .then(({ body }) => {
                    expect(body.msg).toBe('Article not found');
                  });
              });
            });
            describe('Query-specific errors', () => {
              it('Status 400: Sort by invalid column name', () => {
                return request(app)
                  .get('/api/articles/1/comments?sort_by=pigeon')
                  .expect(400)
                  .then(({ body }) => {
                    expect(body.msg).toBe('Invalid type');
                  });
              });
            });
          });
        });
        describe('Diallowed methods', () => {
          it('Status 405: Methods not allowed', () => {
            return request(app)
              .delete('/api/articles/1/comments')
              .expect(405)
              .then(({ body }) => {
                expect(body.msg).toBe('Method not allowed');
              });
          });
        });
      });
    });
  });
  describe('/comments', () => {
    describe('/:comment_id', () => {
      describe('PATCH method', () => {
        it('Status 200: Update comment votes column', () => {
          return request(app)
            .patch('/api/comments/1')
            .send({ inc_votes: 69 })
            .expect(200)
            .then(({ body }) => {
              expect(body.comment).toMatchObject({
                comment_id: 1,
                author: expect.any(String),
                article_id: expect.any(Number),
                votes: expect.any(Number),
                created_at: expect.any(String),
                body: expect.any(String)
              });
              expect(body.comment.votes >= 69).toBe(true);
            });
        });
        it('Status 200: Handle negative values', () => {
          return request(app)
            .patch('/api/comments/2')
            .send({ inc_votes: -321 })
            .expect(200)
            .then(({ body }) => {
              expect(body.comment.comment_id).toBe(2);
              expect(body.comment.votes <= -300).toBe(true);
            });
        });
        describe('Error handling', () => {
          it('Status 400: Value not valid', () => {
            return request(app)
              .patch('/api/comments/3')
              .send({ inc_votes: 'this should not work' })
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).toBe('Invalid type');
              });
          });
          it('Status 400: Unrecognised key', () => {
            return request(app)
              .patch('/api/comments/5')
              .send({ votes: 10 })
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).toBe('Votes update not recognised');
              });
          });
          it('Status 400: Invalid comment_id', () => {
            return request(app)
              .patch('/api/comments/my_favourite_comment')
              .send({ inc_votes: 7 })
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).toBe('Invalid type');
              });
          });
          it('Status 404: comment_id not found', () => {
            return request(app)
              .patch('/api/comments/321')
              .send({ inc_votes: 10 })
              .expect(404)
              .then(({ body }) => {
                expect(body.msg).toBe('Comment not found');
              });
          });
        });
      });
      describe('DELETE method', () => {
        it('Status 204: Successfully delete comment', () => {
          return request(app)
            .delete('/api/comments/1')
            .expect(204)
            .then(() => {
              return connection
                .select('*')
                .from('comments')
                .where('comment_id', 1);
            })
            .then((comment) => {
              expect(comment).toHaveLength(0);
            });
        });
        describe('Error handling', () => {
          it('Status 400: Invalid comment_id', () => {
            return request(app)
              .delete('/api/comments/a_comment')
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).toBe('Invalid type');
              });
          });
          it('Status 404: comment_id not found', () => {
            return request(app)
              .delete('/api/comments/324')
              .expect(404)
              .then(({ body }) => {
                expect(body.msg).toBe('Comment not found');
              });
          });
        });
      });
      describe('Methods not allowed', () => {
        it('Status 405: Not allowed', () => {
          return request(app)
            .get('/api/comments/7')
            .expect(405)
            .then(({ body }) => {
              expect(body.msg).toBe('Method not allowed');
            });
        });
      });
    });
  });
});
