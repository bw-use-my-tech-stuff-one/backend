const db = require('../../database/dbConfig')

module.exports = {
    getUsers,
    getUserById,
    getListingsByOwnerId,
    getListingsByRenterId
}
// gets all users
function getUsers(){
    return db('users')
}

// gets users by id
function getUserById(id){
    return db('users')
        .where({id})
        .first()
}

// gets users by owner_id
function getListingsByOwnerId(id){
    return db('listings')
        .where({owner_id: id})
}

// gets users by renter_id
function getListingsByRenterId(id){
    return db('listings')
        .where({renter_id: id})
}

// get listings by user id
function getTasks(){
    return db.select('projects.name as project_name', 'projects.description as project_description', 'tasks.description as tasks_description', 'tasks.notes', 'tasks.completed')
        .from('tasks')
        .join('projects', 'tasks.project_id', 'projects.id')
}