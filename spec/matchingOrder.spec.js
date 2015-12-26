'use strict';
// the next test are being performed by using the features from Apolog

var example = './spec/features/matchingOrder.feature';

loadFeature(example);

describe("Order in matching is relevant", function() {

  var errors,
      execution_map = {
        _1: { count: 0 },
        _2: { count: 0 },
        _3: { count: 0 },
        _4: { count: 0 },
        __1: { count: 0 },
        __2: { count: 0 },
        __3: { count: 0 },
        str: { count: 0 },
        reg: { count: 0 }
      };

  feature('Matching order', function() {
    scenario('A lot of similar steps', function() {
      step(/(.*) (.*) (.*) (.*)/, function(a, b, c, d) {
        execution_map._4.count++;
      });
      step(/(.*) (.*) (.*) Param/, function(a, b, c) {
        execution_map._3.count++;
      });
      step(/(.*) (.*) Param Param/, function(a, b) {
        execution_map._2.count++;
      });
      step(/(.*) Param Param Param/, function(a) {
        execution_map._1.count++;
      });
      step(/Param Param Param Param/, function() {
        execution_map.reg.count++;
      });
      step(/Param Param Param (.*)/, function(a) {
        execution_map.__1.count++;
      });
      step(/Param Param (.*) (.*)/, function(a, b) {
        execution_map.__2.count++;
      });
      step(/Param (.*) (.*) (.*)/, function(a, b, c) {
        execution_map.__3.count++;
      });
      step("Param Param Param Param", function() {
        execution_map.str.count++;
      });
    });

  });

  errors = run();

  it("calls the most concrete function", function() {
    console.log(execution_map);
  });

  it("calls the most abstract function", function() {

  });
});



