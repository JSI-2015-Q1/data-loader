/* jshint node:true, jasmine:true */
'use strict';

var dataSource = require('../lib/dataSource');
var _ = require('lodash');

describe('handleContents', function() {
  beforeEach(function() {
    this.contents = 'country,population,area,gdp\n' +
                    'USA,320206000,9857306,16720000000000\n' +
                    'Russia,143975923,17098242,3559000000000\n' +
                    'Lesotho,2067000,30355,4277000000\n';
  });

  it('zips the header with each row', function(done) {
    var source = new dataSource.CSVSource();
    source.handleRecord = _.identity;
    source.tableName = _.constant('countries');
    source.handleContents(this.contents, function(records) {
      expect(records).toEqual([
        {
          'country': 'USA',
          'population': '320206000',
          'area': '9857306',
          'gdp': '16720000000000',
        },
        {
          'country':'Russia',
          'population': '143975923',
          'area':'17098242',
          'gdp': '3559000000000'
        },
        {
          'country': 'Lesotho',
          'population': '2067000',
          'area':'30355',
          'gdp': '4277000000'
        }

      ]);
      done();
    });
  });

  it('calls handleRecord with each record', function() {
    var expectedRecords = [
      {
        'country': 'USA',
        'population': '320206000',
        'area': '9857306',
        'gdp': '16720000000000',
      },
      {
        'country':'Russia',
        'population': '143975923',
        'area':'17098242',
        'gdp': '3559000000000'
      },
      {
        'country': 'Lesotho',
        'population': '2067000',
        'area':'30355',
        'gdp': '4277000000'
      }
    ];
    var source = new dataSource.CSVSource();
    var atLeastOneRecordHandled = false;
    source.tableName = _.constant('countries');
    source.handleRecord = function(record) {
      expect(record).toEqual(expectedRecords.shift());
      atLeastOneRecordHandled = true;
    };
    source.handleContents(this.contents, function() {});
    expect(atLeastOneRecordHandled).toBe(true);
  });
});
