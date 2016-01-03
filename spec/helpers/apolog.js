'use strict'
var apolog = require('../../index.js'),
    fs = require('fs'),
    _loadFeature = require('../../index.js').loadFeature;

global.feature = apolog.feature;
global.scenario = apolog.scenario;
global.background = apolog.background;
global.given = apolog.given;
global.when = apolog.when;
global.then = apolog.then;
global.step = apolog.step;
global.loadFeature = apolog.loadFeature;
global.run = apolog.run;
global.loadFeature = function(feature) {
  _loadFeature(fs.readFileSync(feature, 'utf8'), {
    path: feature
  });
};

