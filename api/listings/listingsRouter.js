const express = require('express')
const router = express.Router()

const Listings = require('./listingsModel')
const restricted = require('../auth/restrictedMiddleware')

router.use(restricted)

// gets all listings
router.get('/', (req, res) => {
    Listings.getListings()
        .then(listings => {
            res.status(201).json(listings)
        })
        .catch(() => {
            res.status(500).json({ message: 'listings could not be retrieved.'})
        })
})

// posts a new Listing
router.post('/', (req, res) => {
    if (req.body.owner_id == req.jwt.sub && req.body.is_currently_available === true) {
        Listings.addListing(req.body)
            .then(newListing => {
                res.status(201).json(newListing)
            })
            .catch(() => {
                res.status(500).json({ message: 'Listing could not be added.'})
            })
    } else {
        res.status(400).json({ message: 'You must be the owner of the listing to post it.'})
    }
})

// get listing by id
router.get('/:id', (req, res) => {
    // console.log(req.params.id)
    // get listing
    Listings.getListingById(req.params.id)
        .then(listing => {
            // console.log(listing)
            res.status(201).json(listing)
        })
        .catch(() => {
            res.status(500).json({ message: `The listing with an id of ${req.params.id} could not be retrieved` })
        })
 })


// updates listing
router.put('/:id', (req, res) => {
    if (req.jwt.type === 'owner') {
        if (req.body.owner_id === req.jwt.sub) {
            Listings.getListingById(req.params.id)
                .then(listing => {
                    if (listing.owner_id === req.jwt.sub) {
                        // console.log(listing)
                        Listings.updateListing(req.body, req.params.id)
                            .then(updatedListing => {
                                // console.log(updatedListing)
                                res.status(201).json(updatedListing)
                            })
                            .catch (() => {
                                res.status(500).json({ message: 'Failed to update listing' })
                            })
                    } else {
                        res.status(400).json({ message: 'You must be the owner of the listing to update it.'})
                    }
                })
                .catch (() => {
                    res.status(404).json({ message: 'Could not find listing with given id'  })
                })
        } else {
            res.status(400).json({ message: 'Users cannot transfer ownership of a listing.'})
        }
    } else if (req.jwt.type === 'renter') {
        Listings.getListingById(req.params.id)
                .then(listing => {
                    // only is_currently_available and renter_id should be changed
                    if (listing.name === req.body.name && listing.description === req.body.description, listing.exchange_method === req.body.exchange_method, listing.price_per_day_in_dollars === req.body.price_per_day_in_dollars, listing.is_currently_available !== req.body.is_currently_available && listing.owner_id === req.body.owner_id && req.jwt.sub === req.body.renter_id) {
                        // console.log(listing)
                        Listings.updateListing(req.body, req.params.id)
                            .then(updatedListing => {
                                // console.log(updatedListing)
                                res.status(201).json(updatedListing)
                            })
                            .catch (() => {
                                res.status(500).json({ message: 'Failed to update listing' })
                            })
                    } else {
                        res.status(400).json({ message: 'Invalid rental' })
                    }
                    
                })
                .catch (() => {
                    res.status(404).json({ message: 'Could not find listing with given id'  })
                })
    }
    
})

// deletes listing
router.delete('/:id', (req, res) => {
    Listings.getListingById(req.params.id)
        .then(listing => {
            if (listing.owner_id === req.jwt.sub) {
                // console.log(listing)
                Listings.removeListing(req.params.id)
                    .then(deleted => {
                        if (deleted) {
                            res.status(201).json({ message: `Listing with id of ${req.params.id} was deleted` })
                        } else {
                            res.status(500).json({ message: 'Failed to delete Listing' })
                        }
                    })
                    .catch(() => {
                        res.status(404).json({ message: `Could not find Listing with id of ${req.params.id}` })
                    })
            } else {
                res.status(400).json({ message: 'You must be the owner of the listing to delete it.'})
            }
        })
        .catch (() => {
            res.status(404).json({ message: 'Could not find listing with given id'  })
        })
})

module.exports = router