/* jshint node:true */
'use strict';

var knex = require('knex');
var _ = require('lodash');

var config = require('../knexfile').development.connection;

module.exports.configure = function(newConfig) {
  _.merge(config, newConfig);
}

module.exports.load = function(records, tablename) {
  var db = knex({
    client: 'pg',
    connection: config
  });

  db.insert(records).into(tablename);

  db.destroy();
};
