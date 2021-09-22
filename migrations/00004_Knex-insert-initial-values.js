exports.up = async function(knex) {
    return knex.schema.raw(`
        UPDATE users SET balance = ABS(RANDOM() % 5000)
    `) 
}

exports.down = function(knex) {
    return void(0);
}
