const db = require('../../database/dbConfig')

module.exports = {
    getUsers,
    getUserById,
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