'use strict';
// the next test are being performed by using the features from Apolog

var apolog = require('../index.js'),
    feature = apolog.feature,
    scenario = apolog.scenario,
    given = apolog.given,
    when = apolog.when,
    then = apolog.then,
    loadFeature = apolog.loadFeature,
    run = apolog.run,
    fs = require('fs'),
    example = {
      file: {
        path: 'matchingOrder.feature'
      },
      content: fs.readFileSync('./spec/features/matchingOrder.feature', 'utf8')
    };

loadFeature(example.content, example.file);

describe("Order in matching is relevant", function() {

  var execution_map = {};

  run();

  it("calls the most concrete function", function() {

  });

  it("calls the most abstract function", function() {

  });
});



