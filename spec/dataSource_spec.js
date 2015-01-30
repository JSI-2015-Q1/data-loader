/* jshint node:true, jasmine:true */
'use strict';

var dataSource = require('../lib/dataSource');
var fs = require('fs');
var path = require('path');
var _ = require('lodash');

describe('load data sources', function() {
  it('finds all the sources in the dataSources directory', function(done) {
    var sourcesDir = path.join(__dirname, '..', 'lib', 'dataSources');
    fs.readdir(sourcesDir, function(err, files) {
      if (err) {throw err;}
      dataSource.loadDataSources(function(sources) {
        expect(files.length).toEqual(sources.length);
        done();
      });
    });
  });

  it('returns an array with a handler method', function(done) {
    dataSource.loadDataSources(function(sources) {
      expect(typeof sources.handler).toBe('function');
      done();
    });
  });

  describe('sources.handler', function() {
    it('returns a class that can handle the filename', function(done) {
      dataSource.loadDataSources(function(sources) {
        var fakeSources = [
          {
            handles: _.constant(false),
            name: 'does not work'
          },
          {
            handles: _.constant(true),
            name: 'works'
          }
        ];
        fakeSources.handler = sources.handler;

        expect(fakeSources.handler('rabbits.json').name).toEqual('works');
        done();
      });
    });

    it('raises an error if it finds no handler', function(done) {
      dataSource.loadDataSources(function(sources) {
        expect(function() {
          sources.handler('rabbits.json');
        }).toThrowError('no handler found for rabbits.json');
        done();
      });
    });

    it('strips off the path from the filename', function(done) {
      dataSource.loadDataSources(function(sources) {
        var fakeSources = [
          {
            handles: function(filename) {return filename === 'rabbits.json';},
            name: 'works'
          }
        ];
        fakeSources.handler = sources.handler;

        expect(fakeSources.handler('path/to/rabbits.json').name).toEqual('works');
        done();
      });
    });
  });
});
