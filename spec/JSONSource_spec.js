/* jshint node:true, jasmine:true */
'use strict';

var dataSource = require('../lib/dataSource');
var _ = require('lodash');

describe('JSONSource', function() {
  describe('handleContents', function() {
    it('parses the file as JSON', function() {
      var source = new dataSource.JSONSource();
      var handled = false;
      source.handleRecord = function(record) {
        expect(record).toEqual({
          'number': 'threeve',
          'wager': '$Texas'
        });
        handled = true;
      };

      source.handleContents('[{"number":"threeve", "wager": "$Texas"}]');
      expect(handled).toBe(true);
    });

    it('can drill into outer nested keys', function() {
      var handled = false;

      var source = new dataSource.JSONSource();
      source.pathToRecords = ['rounds', 'final'];
      source.handleRecord = function(record) {
        expect(record).toEqual({
          'number': 'threeve',
          'wager': '$Texas'
        });
        handled = true;
      };

      source.handleContents('{"rounds": {"final": [' +
                              '{"number":"threeve", "wager": "$Texas"}'+
                            ']}}');
      expect(handled).toBe(true);
    });
  });
});
