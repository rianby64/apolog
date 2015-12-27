'use strict';
// the next test are being performed by using the features from Apolog

var example = './spec/features/matchingOrder.feature';

loadFeature(example);

describe("Order in matching is relevant", function() {

  var errors, order = 1,
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
        execution_map._4.order = order++;
      });
      step(/(.*) (.*) (.*) Param/, function(a, b, c) {
        execution_map._3.count++;
        execution_map._3.order = order++;
      });
      step(/(.*) (.*) Param Param/, function(a, b) {
        execution_map._2.count++;
        execution_map._2.order = order++;
      });
      step(/(.*) Param Param Param/, function(a) {
        execution_map._1.count++;
        execution_map._1.order = order++;
      });
      step(/Param Param Param Param/, function() {
        execution_map.reg.count++;
        execution_map.reg.order = order++;
      });
      step(/Param Param Param (.*)/, function(a) {
        execution_map.__1.count++;
        execution_map.__1.order = order++;
      });
      step(/Param Param (.*) (.*)/, function(a, b) {
        execution_map.__2.count++;
        execution_map.__2.order = order++;
      });
      step(/Param (.*) (.*) (.*)/, function(a, b, c) {
        execution_map.__3.count++;
        execution_map.__3.order = order++;
      });
      step("Param Param Param Param", function() {
        execution_map.str.count++;
        execution_map.str.order = order++;
      });
    });

  });

  errors = run();

  it("with no errors", function() {
    expect(errors.length).toBe(0);
  });

  it("so matching is from most concrete function", function() {
    expect(execution_map._4.count).toBe(1);
    expect(execution_map._4.order).toBe(1);

    expect(execution_map._3.count).toBe(1);
    expect(execution_map._3.order).toBe(2);

    expect(execution_map._2.count).toBe(1);
    expect(execution_map._2.order).toBe(3);

    expect(execution_map._1.count).toBe(1);
    expect(execution_map._1.order).toBe(4);
  });

  it("to most abstract function", function() {
    expect(execution_map.__1.count).toBe(1);
    expect(execution_map.__1.order).toBe(5);

    expect(execution_map.__2.count).toBe(1);
    expect(execution_map.__2.order).toBe(6);

    expect(execution_map.__3.count).toBe(1);
    expect(execution_map.__3.order).toBe(7);
  });

  it("where string definition is more relevant than regular expression", function() {
    expect(execution_map.str.count).toBe(1);
    expect(execution_map.str.order).toBe(8);

    expect(execution_map.reg.count).toBe(0);
    expect(execution_map.reg.order).toBe(undefined);
  });
});



