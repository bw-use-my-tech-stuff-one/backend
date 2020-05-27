const express = require('express')
const router = express.Router()

const Users = require('./usersModel')
const restricted = require('../auth/restrictedMiddleware')

router.use(restricted)

// gets all users
router.get('/', (req, res) => {
    Users.getUsers()
        .then(users => {
            res.status(201).json(users)
        })
        .catch(() => {
            res.status(500).json({ message: 'Users could not be retrieved.'})
        })
})

// get user by id including its associated resources and tasks
router.get('/:id', (req, res) => {
    // console.log(req.params.id)
    // get user
    Users.getUserById(req.params.id)
        .then(user => {
            // console.log(user)
            if (user.type === 'owner'){
                Users.getListingsByOwnerId(user.id)
                    .then(listings => {
                        res.status(201).json({ user, listings })
                    })
                    .catch(() => {
                        res.status(500).json({ message: `The listings with an owner_id of ${req.params.id} could not be retrieved` })
                    })
            } else {
                Users.getListingsByRenterId(user.id)
                    .then(listings => {
                        res.status(201).json({ user, listings })
                    })
                    .catch(() => {
                        res.status(500).json({ message: `The listings with a renter_id of ${req.params.id} could not be retrieved` })
                    })
            }
        })
        .catch(() => {
            res.status(500).json({ message: `The user with an id of ${req.params.id} could not be retrieved` })
        })
 })

module.exports = router