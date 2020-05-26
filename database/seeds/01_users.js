
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {id: 1, username: 'user1', password: 'pass1', type: 'owner', email: 'user1@gmail.com'},
        {id: 2, username: 'user2', password: 'pass2', type: 'owner', email: 'user2@gmail.com'},
        {id: 3, username: 'user3', password: 'pass3', type: 'owner', email: 'user3@gmail.com'},
        {id: 4, username: 'user4', password: 'pass4', type: 'owner', email: 'user4@gmail.com'},
        {id: 5, username: 'user5', password: 'pass5', type: 'renter', email: 'user5@gmail.com'},
        {id: 6, username: 'user6', password: 'pass6', type: 'renter', email: 'user6@gmail.com'},
        {id: 7, username: 'user7', password: 'pass7', type: 'renter', email: 'user7@gmail.com'},
        {id: 8, username: 'user8', password: 'pass8', type: 'renter', email: 'user8@gmail.com'}
      ]);
    });
};
