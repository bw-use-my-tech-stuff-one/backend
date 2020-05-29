const request = require('supertest')
const server = require('../server')
const db = require('../../database/dbConfig')

beforeEach(async () => {
    await db('listings').truncate()
    await db('users').truncate()
    await db.seed.run()
})

describe('users', () => {
    // test for registering a new user
    describe('post request to /api/auth/register', () => {
        it('should return username and a token', async () => {
            return request(server)
                .post('/api/auth/register')
                .send({
                    username: 'testUser',
                    password: 'testPass',
                    type: 'owner',
                    email: 'test@email.com'
                })
                .then(response => {
                    // we get username and truthy token 
                    // console.log(response.body)
                    expect(response.body.data.username).toBe('testUser')
                    expect(response.body.token).toBeTruthy()
                })
            
        })
        it('should return a status 201', async () => {
            return request(server)
                .post('/api/auth/register')
                .send({
                    username: 'testUser',
                    password: 'testPass',
                    type: 'owner',
                    email: 'test@email.com'
                })
                .then(response => {
                    expect(response.status).toBe(201)
                })
        })
    })
    // test for logging in a user
    describe('post request to /api/auth/login', () => {
        it('should return an array', () => {
            return request(server)
                .post('/api/auth/login')
                .send({
                    username: 'user1',
                    password: 'pass1'
                })
                .then(response => {
                    // got back user data and token
                    expect(response.body.data.username).toBeTruthy()
                    expect(response.body.token).toBeTruthy()
                })
        })
        it('should return a status 200', () => {
            return request(server)
                .post('/api/auth/login')
                .send({
                    username: 'user1',
                    password: 'pass1'
                })
                .then(response => {
                    expect(response.status).toBe(200)
                })
        })
    })
})