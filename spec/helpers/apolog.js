'use strict'
var apolog = require('../../index.js'),
    fs = require('fs'),
    _loadFeature = apolog.loadFeature;

global.feature = apolog.feature;
global.scenario = apolog.scenario;
global.background = apolog.background;
global.given = apolog.given;
global.when = apolog.when;
global.then = apolog.then;
global.step = apolog.step;
global.and = apolog.and;
global.but = apolog.but;
global.run = apolog.run;
global.loadFeature = function(feature) {
  _loadFeature(fs.readFileSync(feature, 'utf8'), {
    path: feature
  });
};
global.loadFeatures = function(features) {
  if (features instanceof String) {
    loadFeature(features);
  }
  else if (features instanceof Array) {
    features.forEach(function(item) {
      loadFeature(item);
    });
  }
  else {
    throw new Error('unable to load features', features);
  }
};
