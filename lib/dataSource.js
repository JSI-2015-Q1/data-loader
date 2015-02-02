/* jshint node:true */
'use strict';

var fs = require('fs');
var path = require('path');
var _ = require('lodash');

/**
 * searches the dataSources directory for js files and loads them.
 * @returns {Array} containing the list of dataSource handlers.
 */
module.exports.loadDataSources = function(cb) {
    var dataSourceDir = path.join(__dirname, 'dataSources');

    var dataSources = [];
    /**
     * @method
     * @param {string} filename A filename to be handled
     * @description returns the first member of the list that claims to be able to handle the filename
     */
    dataSources.handler = function(filename) {
        filename = _.last(filename.split(path.sep));
        var handler = _.find(this, function(source) {
            return source.handles(filename);
        });
        if (handler !== undefined) {
            return handler;
        } else {
            throw new Error('no handler found for ' + filename);
        }
    };

    fs.readdir(dataSourceDir, function(err, files) {
        if (err) {
            throw err;
        }
        files.forEach(function(filename) {
            var Source = require(path.join(dataSourceDir, filename));
            dataSources.push(new Source());
        });

        cb(dataSources);
    });
};

/**
 * @constructor
 * @classdesc Abstract base class for dataSources.
 */
function DataSource() {}
DataSource.prototype = {
    /**
     * @param {filename} A filename to check
     * @returns {boolean} Whether this dataSource can handle this filename
     */
    handles: function(filename) {
        return false;
    },
    /**
     * @param {Object} record A single record in the data file
     * @returns {Object} A normalized record suitable for the database
     */
    handleRecord: function(record) {
        throw new Error(this.constructor.name + ' needs to implement handleRecord()');
    },
    /**
     * @param {string} contents The contents of the file
     * @param {Function} cb A callback to run once all records are handled. Will be invoked with an array of normalized records.
     */
    handleContents: function(contents, cb) {
        throw new Error(this.constructor.name + ' needs to implement handleContents()');
    },
    /**
     * @returns {string} The name of the table into which this dataSource's normalized records should be inserted.
     */
    tableName: function() {
        throw new Error(this.constructor.name + ' needs to implement tableName()');
    },
    /**
     * @param {string} filename A filename to process
     * @param {Function} cb A callback to run once all records are handled. Will be invoked with an array of normalized records.
     */
    handle: function(filename, cb) {
      var source = this;
      fs.readFile(filename, {'encoding': 'utf-8'}, function(err, contents) {
        source.handleContents(contents, cb);
      });
    }
};
module.exports.DataSource = DataSource;

/**
 * @constructor
 * @classdesc A partially-abstract handler for CSVs. Handles splitting content lines into records and merging them with the header.
 */
function CSVSource() {}
CSVSource.prototype = Object.create(DataSource.prototype);
CSVSource.prototype.constructor = CSVSource;
CSVSource.prototype.handleContents = function(contents, cb) {
  var lines = contents.split(/\n/);
  var header = lines.shift().split(',');
  if (_.last(lines) === '') {
    lines.pop();
  }
  var records = lines.map(function(line) {
      var record = _.object(header, line.split(','));
      return this.handleRecord(record);
  }, this);
  cb(records, this.tableName());
};
module.exports.CSVSource = CSVSource;
