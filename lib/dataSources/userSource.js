'use strict';

var dataSource = require('../dataSource');

var UserSource = function() {
    this.handles = function(filename) {
        return filename.match(/^users\.csv$/);
    };
    this.handleRecord = function(record) {
        return record;
    };
    this.tableName = function() {
        return "users"
    }
};
UserSource.prototype = new dataSource.CSVSource();


module.exports = UserSource;
