process.env.NODE_ENV = 'test';

const dbConnection = require('../db/dbConnection');
const request = require('supertest');
const app = require('../app');

beforeEach(() => {
    dbConnection.seed.run()
})
afterAll(() => {
    dbConnection.destroy()
})

describe('/api', () => {
    describe('/topics', () => {
        describe('GET request', () => {
            test('returns status 200 and the topics', () => {
                return request(app)
                    .get('/api/topics')
                    .expect(200)
                    .then(({body}) => {
                        expect(Array.isArray(body)).toBe(true);
                        expect(body[0]).toMatchObject({
                            slug: expect.any(String),
                            description: expect.any(String)
                        })
                    })
            })
        })
    })
})