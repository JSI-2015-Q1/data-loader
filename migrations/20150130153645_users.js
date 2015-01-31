'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function(table) {
    table.string('name');
    table.string('height');
    table.string('age');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users');
};
