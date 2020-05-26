const db = require('../../database/dbConfig')

module.exports = {
    getListings,
    getListingById,
    addListing,
    updateListing,
    removeListing
}

// gets all listings
function getListings(){
    return db('listings')
}

// gets listings by id
function getListingById(id){
    return db('listings')
        .where({id})
        .first()
}

// inserts a new listings record to listings table
function addListing(newListing){
    return db('listings')
        .insert(newListing, 'id')
        .then(id => {
            return getListingById(id[0])
        })
}

// updates listing
function updateListing(updatedListing, id) {
    return db('listings')
        .where({ id })
            .update(updatedListing)
                .then(() => {
                    return getListingById(id)
                })
}

// removes listing
function removeListing(id) {
    return db('listings')
        .where({ id }).del()
}