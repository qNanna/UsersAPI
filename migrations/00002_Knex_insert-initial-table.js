exports.up = function(knex) {
    return knex('users').del().then(()=> {
        return knex('users').insert([
            {
                first_name: 'John',
                last_name: 'Doe',
                age: 24,
                email: 'johndoe@gmail.com',
                password: 'dbb04edc'
            },
            {
                first_name: 'John',
                last_name: 'Doe',
                age: 24,
                email: 'johndoe2@gmail.com',
                password: 'dbb04edc'
            }
        ])
    });
}

exports.down = function(knex) {
    return void(0);
}

// 'insert into `users` (`age`, `email`, `first_name`, `last_name`, `password`) select ? as `age`, ? as `email`, ? as `first_name`, ? as `last_name`, ? as `password` union all select ? as `age`, ? as `email`, ? as `first_name`, ? as `last_name`, ? as `password`'