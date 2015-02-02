/* jshint node:true */
'use strict';

var dataSource = require('../dataSource');

/**
  * @constructor
  * @classdesc Handles a "users.csv" for insertion into the users table.
  * This class assumes the users.csv is correctly formatted already.
  */
function UserSource() {
    this.handles = function(filename) {
        return filename.match(/^users\.csv$/);
    };
    this.handleRecord = function(record) {
        return record;
    };
    this.tableName = function() {
        return 'users';
    };
};
UserSource.prototype = Object.create(dataSource.CSVSource.prototype);
UserSource.prototype.constructor = UserSource;

module.exports = UserSource;
