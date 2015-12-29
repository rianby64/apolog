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
    //console.log(f, "feature");
    scenario(/Scenario ([A-Za-z]+)/, function(s) {
      //console.log(f, s, "scenario");

      execution_map.context.scenario = execution_map.context.scenario || { map: "" };
      execution_map.context.scenario.map += s;
      given(/A given ([A-Za-z]+) ([A-Za-z]+)/,  function(a, b) {
        //console.log(f, s, a, b, "A given");

        execution_map.context.scenario.given = execution_map.context.scenario.given || { map: "" };
        execution_map.context.scenario.given.map += f + s + a + b + '.';
      });
    });
    when(/A when ([A-Za-z]+) ([A-Za-z]+)/, function(a, b) {
      //console.log(f, a, b, "A when");

      execution_map.context.when = execution_map.context.when || { map: "" };
      execution_map.context.when.map += f + a + b + '.';
    });
  });
  then(/An step ([A-Za-z]+) ([A-Za-z]+)/, function(a, b) {
    //console.log(a, b, "An step");

    execution_map.then = execution_map.then || { map: "" };
    execution_map.then.map += a + b + '.';
  });

  errors = run();
  it('with a correct shared execution map', function() {
    expect(execution_map.context.map).toBe("AB");
    expect(execution_map.context.scenario.map).toBe("ABAB");
    expect(execution_map.context.scenario.given.map).toBe("AACD.ABIJ.BAOP.BBUV.");
    expect(execution_map.context.when.map).toBe("AEF.AKL.BQR.BWX.");
    expect(execution_map.then.map).toBe("GH.MN.ST.YZ.");

    expect(errors.length).toBe(0);
  });
});

