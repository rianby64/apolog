'use strict';
// the next test are being performed by using the features from Apolog

var example = [
      './spec/features/contextA.feature',
      './spec/features/contextB.feature'
    ];

describe("Sharing context execution", function() {
  var execution_map = {}, errors;
  loadFeature(example[0]);
  loadFeature(example[1]);

  feature(/Context ([A-Za-z]+)/, function(f) {
    execution_map.context = execution_map.context || { map: "" };
    execution_map.context.map += f;
    scenario(/Scenario ([A-Za-z]+)/, function(s) {
      execution_map.context.scenario = execution_map.context.scenario || { map: "" };
      execution_map.context.scenario.map += s;
      given(/A given ([A-Za-z]+) ([A-Za-z]+)/,  function(a, b) {
        execution_map.context.scenario.given = execution_map.context.scenario.given || { map: "" };
        execution_map.context.scenario.given.map += f + s + a + b + ".";
      });
      when(/A when ([A-Za-z]+) ([A-Za-z]+)/, function(a, b) {
        execution_map.context.scenario.when = execution_map.context.scenario.when || { map: "" };
        execution_map.context.scenario.when.map += f + s + a + b + ".";
      });
      then(/An step ([A-Za-z]+) ([A-Za-z]+)/, function(a, b) {
        execution_map.context.scenario.then = execution_map.context.scenario.then || { map: "" };
        execution_map.context.scenario.then.map += f + s + a + b + ".";
      });
    });
  });

  errors = run();
  it('with a correct shared execution map', function() {
    expect(execution_map.context.map).toBe("AB");

    expect(execution_map.context.scenario.map).toBe("ABAB");

    expect(execution_map.context.scenario.given.map).toBe("AACD.ABIJ.BAOP.BBUV.");
    expect(execution_map.context.scenario.when.map).toBe("AAEF.ABKL.BAQR.BBWX.");
    expect(execution_map.context.scenario.then.map).toBe("AAGH.ABMN.BAST.BBYZ.");

    expect(errors.length).toBe(0);
  });
});

