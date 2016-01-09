'use strict';
// the next test are being performed by using the features from Apolog

var example = [
      './spec/features/backgroundA.feature',
      './spec/features/backgroundB.feature',
      './spec/features/backgroundC.feature',
      './spec/features/backgroundD.feature'
    ];

describe("Sharing background execution", function() {
  var execution_map = {}, errors;
  example.forEach(function(item) {
    loadFeature(item);
  });

  feature(/Feature (A)/, function(f) {
    execution_map.feature_a = execution_map.feature_a || { map: "" };
    execution_map.feature_a.map += "[" + f + "]";
    background(/Background/, function() {
      given(/a background/, function() {
        execution_map.feature_a.map += "[bg]";
      });
    });
    scenario(/Scene ([A-Za-z]+)/, function(s) {
      execution_map.feature_a.map += s;
      given(/a given/,  function() {
        execution_map.feature_a.map += "[g" + s + "]";
      });
    });
  });

  feature("Feature B", function() {
    console.log('no puede ser...B');
    execution_map.feature = execution_map.feature || { map: "" };
    execution_map.feature.map += "B";
    background(/Background/, function() {
      given(/a background/, function() {

      });
    });
    scenario(/Scene ([A-Za-z]+)/, function(s) {
      given(/a given/,  function() {
      });
    });
  });

  feature("Feature C", function() {
    console.log('no puede ser...C');
    execution_map.feature = execution_map.feature || { map: "" };
    execution_map.feature.map += "C";
    background(/Background/, function() {
      given(/a background/, function() {

      });
    });
    scenario(/Scene ([A-Za-z]+)/, function(s) {
      given(/a given/,  function() {
      });
    });
  });

  feature("Feature D", function() {
    console.log('no puede ser...D');
    execution_map.feature = execution_map.feature || { map: "" };
    execution_map.feature.map += "D";
    background(/Background/, function() {
      given(/a background/, function() {

      });
    });
    scenario(/Scene ([A-Za-z]+)/, function(s) {
      given(/a given/,  function() {
      });
    });
  });

  errors = run();
  it('with a correct shared execution map', function() {
    expect(execution_map.feature_a.map).toBe("[A]ABC[bg][gA][bg][gB][bg][gC]");
    /*
    expect(execution_map.feature.scenario.when.map).toBe("AAEF.ABKL.BAQR.BBWX.");
    expect(execution_map.feature.scenario.then.map).toBe("AAGH.ABMN.BAST.BBYZ.");
    */
    expect(errors.length).toBe(0);
  });
});

