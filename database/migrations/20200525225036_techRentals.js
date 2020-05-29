
exports.up = function(knex) {
    return knex.schema
        .createTable('users', users => {
            users.increments()
            users.string('username', 100)
                .notNullable()
                .unique()
            users.string('password', 100)
                .notNullable()
            users.string('type', 7)
                .notNullable()
            users.string('email', 100)
                .notNullable()
                .unique()
        })
        .createTable('listings', listing => {
            listing.increments()
            listing.text('name', 100)
                .notNullable()
            listing.text('description', 500)
                .notNullable()
            listing.text('exchange_method', 500)
                .notNullable()
            listing.float('price_per_day_in_dollars', 8, 2)
                .unsigned()
                .notNullable()
            listing.boolean('is_currently_available')
                .defaultTo('true')
            listing.integer('owner_id')
                .unsigned()
                .notNullable()
                .references('id')
                .inTable('users')
                .onUpdate('CASCADE')
                .onDelete('CASCADE') 
            listing.integer('renter_id')
                .unsigned()
                .references('id')
                .inTable('users')
                .onUpdate('CASCADE')
                .onDelete('CASCADE') 
        })
}

exports.down = function(knex) {
    return knex.schema
        .dropTableIfExists('listings')
        .dropTableIfExists('users')
}
