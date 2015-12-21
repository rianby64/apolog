'use strict';
// the next test are being performed by using the features from Apolog

var apolog = require('../index.js'),
    fs = require('fs'),
    example = {
      file: {
        path: 'simpleFeature.feature'
      },
      content: fs.readFileSync('./spec/features/simpleFeature.feature', 'utf8')
    };

apolog.loadFeature(example.content, example.file);
describe("it parsers a simple feature", function() {
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
        background_given: function() {
          background_given++;
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
        when: function* () {
          when++;
          yield {};
        },
        then: function* (done) {
          then++;
          // If you use async context with a generator* then the done param is undefined
          // Sounds like "Rise Up". So, generator has higher priority than async
          expect(done).toBe(undefined);
          yield {};
        }
      };
  apolog.feature('Simple Feature', functions.feature);
  apolog.run();
  it('so "feature" was called', function() {
    expect(feature).toBe(1);
  });
  it('so "background" was called', function() {
    expect(background).toBe(1);
  });
  it('so "background given" step was called as normal function', function() {
    expect(background_given).toBe(1);
  });
  it('so "scenario" was called', function() {
    expect(scenario).toBe(1);
  });
  it('so "given" was called as async function with done() parameter', function() {
    expect(given).toBe(1);
  });
  it('so "when" was called as a function*', function() {
    expect(when).toBe(1);
  });
  it('the then was called as async function* with done() === undefined parameter', function() {
    expect(then).toBe(1);
  });
});



