'use strict';
// the next test are being performed by using the features from Apolog

var apolog = require('../index.js'),
    fs = require('fs'),
    example = {
      file: {
        path: 'simpleFeature.feature'
      },
      content: fs.readFileSync('./spec/simpleFeature.feature', 'utf8')
    };

apolog.loadFeature(example.content, example.file);
describe("it parsers a simple feature in a natural way async", function() {
  var feature = 0,
      background = 0,
      background_given = 0,
      scenario = 0,
      given = 0,
      when = 0,
      then = 0,
      functions = {
        feature: function() {
          feature++;
          apolog.background('A background', functions.background);
          apolog.scenario('Simple scenario', functions.scenario);
        },
        background: function() {
          background++;
          apolog.given('a given background', functions.background_given);
        },
        background_given: function(done) {
          background_given++;
          done();
        },
        scenario: function() {
          scenario++;
          apolog.given('A given', functions.given);
          apolog.when('A when', functions.when);
          apolog.then('A step', functions.then);
        },
        given: function(done) {
          given++;
          done();
        },
        when: function(done) {
          when++;
          done();
        },
        then: function(done) {
          then++;
          done();
        }
      };
  apolog.feature('Simple Feature', functions.feature);
  apolog.run();
  it('the feature was called', function() {
    expect(feature).toBe(1);
  });
  it('the background was called', function() {
    expect(background).toBe(1);
  });
  it('the background given step was called', function() {
    expect(background_given).toBe(1);
  });
  it('the scenario was called', function() {
    expect(scenario).toBe(1);
  });
  it('the given was called', function() {
    expect(given).toBe(1);
  });
  it('the when was called', function() {
    expect(when).toBe(1);
  });
  it('the then was called', function() {
    expect(then).toBe(1);
  });
});



