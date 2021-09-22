exports.up = function(knex) {  
  return knex.schema.createTable('users', table => {
      table.increments('id');
      table.string('first_name');
      table.string('last_name');
      table.integer('age');
      table.string('email');
      table.string('password');
    })
};

exports.down = function(knex) {  
  return void(0);
};

/*
CREATE TABLE "users" (
    "id" serial primary key, 
    "first_name" varchar(255), 
    "last_name" varchar(255), 
    "age" integer, 
    "email" varchar(255), 
    "password" varchar(255)
)
*/