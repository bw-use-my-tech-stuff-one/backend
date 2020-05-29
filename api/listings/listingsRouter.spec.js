const request = require('supertest')
const server = require('../server')
const db = require('../../database/dbConfig')
const createToken = require('../auth/createToken')

beforeEach(async () => {
    await db('listings').truncate()
    await db('users').truncate()
    await db.seed.run()
})

// tests for the listings router
describe('listings operations', () => {
    // make sure test tokens and test user info is available to all tests by initializing them outside the tests
    let testOwner = {
        id: 1, 
        username: 'user1',
        type: 'owner', 
        email: 'user1@gmail.com'
    }
    let testRenter = {
        id: 5,
        username: 'user5',
        type: 'renter',
        email: 'user5@gmail.com'
    }
    let testOwnerToken = createToken(testOwner)
    let testRenterToken = createToken(testRenter)

    describe('GET request to /api/listings', () => {
        it('should return an array of the listings that are currently available for rent', async () => {
            return request(server)
                .get('/api/listings')
                .set('Authorization', testOwnerToken)
                .then(response => {
                    // we should get an array of the listings in response.body 
                    expect(response.body.length).toBe(2) // 2 listings in the seeds have a "is_currently_available" value of true
                })
        })
        it('should return a status 201', async () => {
            return request(server)
                .get('/api/listings')
                .set('Authorization', testOwnerToken)
                .then(response => {
                    expect(response.status).toBe(201)
                }) 
        })
    })
    describe('GET request to /api/listings/:id', () => {
        it('should return an object and correct name', async () => {
            return request(server)
                .get(`/api/listings/2`)
                .set('Authorization', testOwnerToken)
                .then(response => {
                    // we should get an object of the listings in response.body 
                    expect(typeof(response.body)).toBe('object')
                    expect(response.body.name).toBe('Oculus Rift')
                })
        })
        it('should return a status 201', async () => {
            return request(server)
                .get(`/api/listings/2`)
                .set('Authorization', testOwnerToken)
                .then(response => {
                    expect(response.status).toBe(201)
                })
        })
    })
    describe('POST request to /api/listings/', () => {
        it('should return an object and correct name', async () => {
            return request(server)
                .post('/api/listings')
                .set('Authorization', testOwnerToken)
                .send({
                    name: "2020 Alienware laptop",
                    description: "A great computer that will help you achieve your goals.",
                    exchange_method: "I'll cover the costs of 2-day shipping it to you anywhere in the United States",
                    price_per_day_in_dollars: 25,
                    is_currently_available: true,
                    owner_id: testOwner.id
                })
                .then(response => {
                    expect(typeof(response.body)).toBe('object')
                    expect(response.body.name).toBe('2020 Alienware laptop')
                })
        })
        it('should return a status 201', async () => {
            return request(server)
                .post('/api/listings')
                .set('Authorization', testOwnerToken)
                .send({
                    name: "2020 Alienware laptop",
                    description: "A great computer that will help you achieve your goals.",
                    exchange_method: "I'll cover the costs of 2-day shipping it to you anywhere in the United States",
                    price_per_day_in_dollars: 25,
                    is_currently_available: true,
                    owner_id: testOwner.id
                })
                .then(response => {
                    expect(response.status).toBe(201)
                })
        })
        it('should return a status 400 because the user posting the listing is not the same as the listing owner_id property value', async () => {
            return request(server)
                .post('/api/listings')
                .set('Authorization', testOwnerToken)
                .send({
                    name: "2020 Alienware laptop",
                    description: "A great computer that will help you achieve your goals.",
                    exchange_method: "I'll cover the costs of 2-day shipping it to you anywhere in the United States",
                    price_per_day_in_dollars: 25,
                    is_currently_available: true,
                    owner_id: testOwner.id + 1
                })
                .then(response => {
                    expect(response.status).toBe(400)
                })
        })
    })
    describe('PUT request to /api/listings/:id', () => {
        it('should return an object and correct name', async () => {
            return request(server)
                .put('/api/listings/1')
                .set('Authorization', testOwnerToken)
                .send({
                    name: "2020 Macbook Pro",
                    description: "A great computer that will help you achieve your goals.",
                    exchange_method: "I'll cover the costs of 2-day shipping it to you anywhere in the United States",
                    price_per_day_in_dollars: 25,
                    is_currently_available: true,
                    owner_id: testOwner.id
                })
                .then(response => {
                    expect(typeof(response.body)).toBe('object')
                    expect(response.body.name).toBe('2020 Macbook Pro')
                })
        })
        it('should return a status 201', async () => {
            return request(server)
                .put('/api/listings/1')
                .set('Authorization', testOwnerToken)
                .send({
                    name: "2020 Macbook Pro",
                    description: "A great computer that will help you achieve your goals.",
                    exchange_method: "I'll cover the costs of 2-day shipping it to you anywhere in the United States",
                    price_per_day_in_dollars: 25,
                    is_currently_available: true,
                    owner_id: testOwner.id
                })
                .then(response => {
                    expect(response.status).toBe(201)
                })
        })
        it('should return a status 400 because the listing owner cannot transfer ownership of a listing to another owner', async () => {
            return request(server)
                .put('/api/listings/1')
                .set('Authorization', testOwnerToken)
                .send({
                    name: "Malicious name change",
                    description: "A great computer that will help you achieve your goals.",
                    exchange_method: "I'll cover the costs of 2-day shipping it to you anywhere in the United States",
                    price_per_day_in_dollars: 25,
                    is_currently_available: true,
                    owner_id: testOwner.id + 1 // testOwner is trying to transfer ownership of a post
                })
                .then(response => {
                    expect(response.status).toBe(400)
                    expect(response.body.message).toBe('Users cannot transfer ownership of a listing.')
                })
        })
        it('should return a status 400 because the owner updating the listing is not the same as the listing owner_id property value', async () => {
            return request(server)
                .put('/api/listings/2')
                .set('Authorization', testOwnerToken)
                .send({
                    name: "Malicious name change",
                    description: "A great computer that will help you achieve your goals.",
                    exchange_method: "I'll cover the costs of 2-day shipping it to you anywhere in the United States",
                    price_per_day_in_dollars: 25,
                    is_currently_available: true,
                    owner_id: testOwner.id // testOwner is trying to update someone else's listing
                })
                .then(response => {
                    expect(response.status).toBe(400)
                    expect(response.body.message).toBe('You must be the owner of the listing to update it.')
                })
        })
        it('Simulate a renter renting a listing by adding the id of renter as renter_id and changing is currently available to false', async () => {
            return request(server)
                .put('/api/listings/1')
                .set('Authorization', testRenterToken)
                .send({
                    name: "2020 Macbook Pro",
                    description: "A great computer that will help you achieve your goals.",
                    exchange_method: "I'll cover the costs of 2-day shipping it to you anywhere in the United States",
                    price_per_day_in_dollars: 25,
                    is_currently_available: false, // rental has been made, so listing is no longer available for listing
                    owner_id: 1,
                    renter_id: testRenter.id // renter makes himself the renter of this listing with this request
                })
                .then(response => {
                    expect(response.body.renter_id).toBe(testRenter.id)
                    expect(response.is_currently_available).toBeFalsy()
                    expect(response.status).toBe(201)
                })
        })
        describe('DELETE request to /api/listings/:id', () => {
            it('should return an object, status 201, and correct message', async () => {
                return request(server)
                    .delete(`/api/listings/1`)
                    .set('Authorization', testOwnerToken)
                    .then(response => {
                        expect(typeof(response.body)).toBe('object')
                        expect(response.body.message).toBe('Listing with id of 1 was deleted')
                        expect(response.status).toBe(201)
                    })
            })
            it('Make sure that an owner cannot delete a post that belongs to another', async () => {
                return request(server)
                    .delete(`/api/listings/2`)
                    .set('Authorization', testOwnerToken) // testOwner is not the owner of listing with id of 2, so he should not be able to delete this listing
                    .then(response => {
                        expect(response.status).toBe(400)
                        expect(response.body.message).toBe('You must be the owner of the listing to delete it.')
                    })
            })
        })
    })
    
})