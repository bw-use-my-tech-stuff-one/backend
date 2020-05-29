const request = require('supertest')
const server = require('../server')
const db = require('../../database/dbConfig')
const bcryptjs = require('bcryptjs')
const createToken = require('../auth/createToken')


beforeEach(async () => {
    await db.seed.run()
})

afterEach(async () => {
    await db('listings').truncate()
    await db('users').truncate()
})

// tests for the listings router
describe('listings operations', () => {
    // make sure testToken and loggedUser info is available to all tests by initializing it outside the tests
    const rounds = process.env.BCRYPT_ROUNDS || 8
    const pass1 = bcryptjs.hashSync('pass1', rounds)
    let testUser = {
        id: 1, 
        username: 'user1',
        type: 'owner', 
        email: 'user1@gmail.com'
    }
    let testToken = createToken(testUser)
    // register to access the restricted route
    // beforeEach(async () => {
    //     await request(server)
    //         .post('/api/listings')
    //         .set('Authorization', testToken)
    //         .send({
    //             name: "2019 MacBook Pro",
    //             description: "A great computer that will help you achieve your goals.",
    //             exchange_method: "I'll cover the costs of 2-day shipping it to you anywhere in the United States",
    //             price_per_day_in_dollars: 20,
    //             is_currently_available: true,
    //             owner_id: testUser.id
    //         })
    //         .then(response2 => {
    //             postedListing = response2.body
    //         })
    // })

    describe('GET request to /api/listings', () => {
        it('should return an array', async () => {
            return request(server)
                .get('/api/listings')
                .set('Authorization', testToken)
                .then(response => {
                    // we should get an array of the listings in response.body 
                    expect(response.body.length).toBe(2) // 2 listings in the seeds have a "is_currently_available" value of true
                })
        })
        it('should return a status 201', async () => {
            return request(server)
                .get('/api/listings')
                .set('Authorization', testToken)
                .then(response => {
                    expect(response.status).toBe(201)
                }) 
        })
    })
    describe('GET request to /api/listings/:id', () => {
        it('should return an object', async () => {
            return request(server)
                .get(`/api/listings/2`)
                .set('Authorization', testToken)
                .then(response => {
                    // we should get an object of the listings in response.body 
                    expect(typeof(response.body)).toBe('object')
                    expect(response.body.name).toBe('Oculus Rift')
                })
        })
        it('should return a status 201', async () => {
            return request(server)
                .get(`/api/listings/2`)
                .set('Authorization', testToken)
                .then(response => {
                    expect(response.status).toBe(201)
                })
        })
    })
    describe('POST request to /api/listings/', () => {
        it('should return an object', async () => {
            return request(server)
                .post('/api/listings')
                .set('Authorization', testToken)
                .send({
                    name: "2020 Alienware laptop",
                    description: "A great computer that will help you achieve your goals.",
                    exchange_method: "I'll cover the costs of 2-day shipping it to you anywhere in the United States",
                    price_per_day_in_dollars: 25,
                    is_currently_available: true,
                    owner_id: testUser.id
                })
                .then(response => {
                    expect(typeof(response.body)).toBe('object')
                    expect(response.body.name).toBe('2020 Alienware laptop')
                })
        })
        it('should return a status 201', async () => {
            return request(server)
                .post('/api/listings')
                .set('Authorization', testToken)
                .send({
                    name: "2020 Alienware laptop",
                    description: "A great computer that will help you achieve your goals.",
                    exchange_method: "I'll cover the costs of 2-day shipping it to you anywhere in the United States",
                    price_per_day_in_dollars: 25,
                    is_currently_available: true,
                    owner_id: testUser.id
                })
                .then(response => {
                    expect(response.status).toBe(201)
                })
        })
        it('should return a status 400 because the user posting the listing is not the same as the listing owner_id property value', async () => {
            return request(server)
                .post('/api/listings')
                .set('Authorization', testToken)
                .send({
                    name: "2020 Alienware laptop",
                    description: "A great computer that will help you achieve your goals.",
                    exchange_method: "I'll cover the costs of 2-day shipping it to you anywhere in the United States",
                    price_per_day_in_dollars: 25,
                    is_currently_available: true,
                    owner_id: testUser.id + 1
                })
                .then(response => {
                    expect(response.status).toBe(400)
                })
        })
    })
    
})