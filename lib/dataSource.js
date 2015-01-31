/* jshint node:true */
'use strict';

var fs = require('fs');
var path = require('path');
var _ = require('lodash');

module.exports.loadDataSources = function(cb) {
    var dataSourceDir = path.join(__dirname, 'dataSources');

    var dataSources = [];
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

function DataSource() {}
DataSource.prototype = {
    handles: function(filename) {
        return false;
    },
    handleRecord: function(filename) {
        throw new Error(this.constructor.name + ' needs to implement handleRecord()');
    },
    handleContents: function(filename, cb) {
        throw new Error(this.constructor.name + ' needs to implement handleContents()');
    },
    tableName: function() {
        throw new Error(this.constructor.name + ' needs to implement tableName()');
    },
    handle: function(filename, cb) {
      var source = this;
      fs.readFile(filename, {'encoding': 'utf-8'}, function(err, contents) {
        source.handleContents(contents, cb);
      });
    }
};
module.exports.DataSource = DataSource;

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
