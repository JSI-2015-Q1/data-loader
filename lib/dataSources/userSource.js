/* jshint node:true */
'use strict';

var dataSource = require('../dataSource');

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
