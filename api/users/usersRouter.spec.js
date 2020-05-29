const request = require('supertest')
const server = require('../server')
const db = require('../../database/dbConfig')
const createToken = require('../auth/createToken')

beforeEach(async () => {
    await db('listings').truncate()
    await db('users').truncate()
    await db.seed.run()
})


// tests for the users router
describe('users operations', () => {
    // make sure test tokens and test user info is available to all tests by initializing them outside the tests
    let testUser = {
        id: 1, 
        username: 'user1',
        type: 'owner', 
        email: 'user1@gmail.com'
    }
    let testUserToken = createToken(testUser)

    describe('GET request to /api/users', () => {
        it('should return an array', async () => {
            return request(server)
                .get('/api/users')
                .set('Authorization', testUserToken)
                .then(response => {
                    // we should get an array of the users in response.body 
                    expect(response.body.length).toBe(8) // There are 8 users in the seeds
                })
        })
        it('should return a status 201', async () => {
            return request(server)
                .get('/api/users')
                .set('Authorization', testUserToken)
                .then(response => {
                    expect(response.status).toBe(201)
                }) 
        })
    })
    describe('GET request to /api/users/:id', () => {
        it('should return an object called user with the user info and an array of the listings associated with the user', async () => {
            return request(server)
                .get(`/api/users/1`)
                .set('Authorization', testUserToken) // In this case user is looking at own profile, but this profile info can also be reached by other users
                .then(response => {
                    // we get listings associated with this user: for an owner it's his/her listings, for a renter it's the listings that he/she has chosen to rent
                    expect(typeof(response.body.user)).toBe('object') // user data
                    expect(Array.isArray(response.body.listings)).toBeTruthy() // listings associated with this user
                    expect(response.body.listings[0].name).toBe('2019 MacBook Pro')
                })
        })
        it('should return a status 201', async () => {
            return request(server)
                .get(`/api/users/1`)
                .set('Authorization', testUserToken)
                .then(response => {
                    expect(response.status).toBe(201)
                })
        })
    })
})