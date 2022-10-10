exports.up = async function(knex) {
    return knex.schema.raw(`
        ALTER TABLE users 
        Add balance INTEGER
    `) 
}

exports.down = function(knex) {
    return void(0);
}
