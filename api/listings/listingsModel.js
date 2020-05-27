const db = require('../../database/dbConfig')

module.exports = {
    getListings,
    getListingById,
    addListing,
    updateListing,
    removeListing
}

// gets all listings that are currently available to be rented
function getListings(){
    return db.select('listings.id as id', 'listings.name as name', 'listings.description as description', 'listings.exchange_method as exchange_method', 'listings.price_per_day_in_dollars as price_per_day_in_dollars', 'listings.is_currently_available as is_currently_available', 'listings.owner_id as owner_id', 'listings.renter_id as renter_id', 'users.username as owner_name')
        .from('listings')
        .join('users', 'listings.owner_id', 'users.id')
        .where('listings.is_currently_available', true)
}

// gets listings by id
function getListingById(id){
    return db.select('listings.id as id', 'listings.name as name', 'listings.description as description', 'listings.exchange_method as exchange_method', 'listings.price_per_day_in_dollars as price_per_day_in_dollars', 'listings.is_currently_available as is_currently_available', 'listings.owner_id as owner_id', 'listings.renter_id as renter_id', 'users.username as owner_name')
        .from('listings')
        .join('users', 'listings.owner_id', 'users.id')
        .where('listings.id', id)
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