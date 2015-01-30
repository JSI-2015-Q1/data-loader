/* jslint node:true */
'use strict';

var fs = require('fs');
var path = require('path');
var _ = require('lodash');

module.exports.loadDataSources = function(cb) {
    var dataSourceDir = path.join(__dirname, 'dataSources');

    var dataSources = [];
    dataSources.handler = function(filename) {
        filename = _.last(filename.split(path.sep));
        var handler = _.find(dataSources, function(source) {
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

var DataSource = function() {};
DataSource.prototype = {
    handles: function(filename) {
        return false;
    },
    handleRecord: function(filename) {
        throw new Error(this.constructor.name + ' needs to implement handleRecord()');
    },
    handle: function(filename, cb) {
        throw new Error(this.constructor.name + ' needs to implement handle()');
    },
    tableName: function() {
        throw new Error(this.constructor.name + ' needs to implement tableName()');
    }
};
module.exports.DataSource = DataSource;

var CSVSource = function() {
    this.handle = function(file, cb) {
        var source = this;
        fs.readFile(file, {encoding: 'utf-8'}, function(err, data) {
            if (err) {
                throw err;
            }
            var lines = data.split(/\n/);
            var header = lines.shift().split(',');
            var records = lines.map(function(line) {
                var record = _.object(header, line.split(','));
                return source.handleRecord(record);
            });
            cb(records, source.tableName());
        });
    };
};
CSVSource.prototype = new DataSource();
module.exports.CSVSource = CSVSource;
