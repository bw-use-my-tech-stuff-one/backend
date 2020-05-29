
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('listings').del()
    .then(function () {
      // Inserts seed entries
      return knex('listings').insert([
        {id: 1, name: '2019 MacBook Pro', description: 'A great computer that will help you achieve your goals.', exchange_method: "I'll cover the costs of 2-day shipping it to you anywhere in the United States", price_per_day_in_dollars: 20, is_currently_available: true, owner_id: 1},
        {id: 2, name: 'Oculus Rift', description: 'A VR headset that you can use to play the ultimate immersive games.', exchange_method: "I'll cover 7-day shipping, or I can expedite the shipping for an additional cost.", price_per_day_in_dollars: 15, is_currently_available: true, owner_id: 2},
        {id: 3, name: 'DJ Sound System', description: '2 speakers, 4 microphones, and a sound manipulation system that will help make your party a success.', exchange_method: 'We meet up at an agreed location in LA and exhange it in person.', price_per_day_in_dollars: 200, is_currently_available: false, owner_id: 1, renter_id: 5}
      ]);
    });
};
