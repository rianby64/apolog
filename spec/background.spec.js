'use strict';
// the next test are being performed by using the features from Apolog

var example = [
      './spec/features/backgroundA.feature',
      './spec/features/backgroundB.feature',
      './spec/features/backgroundC.feature',
      './spec/features/backgroundD.feature'
    ];

describe("Sharing context execution", function() {
  var execution_map = {}, errors;
  example.forEach(function(item) {
    loadFeature(item);
  });

  feature(/Feature (A)/, function(f) {
    execution_map.context = execution_map.context || { map: "" };
    execution_map.context.map += f;
    background(/Background/, function() {
      given(/a background/, function() {

      });
    });
    scenario(/Scene ([A-Za-z]+)/, function(s) {
      given(/a given/,  function() {
      });
    });
  });

  feature(/Feature (B)/, function(f) {
    execution_map.context = execution_map.context || { map: "" };
    execution_map.context.map += f;
    background(/Background/, function() {
      given(/a background/, function() {

      });
    });
    scenario(/Scene ([A-Za-z]+)/, function(s) {
      given(/a given/,  function() {
      });
    });
  });

  feature(/Feature (C)/, function(f) {
    execution_map.context = execution_map.context || { map: "" };
    execution_map.context.map += f;
    background(/Background/, function() {
      given(/a background/, function() {

      });
    });
    scenario(/Scene ([A-Za-z]+)/, function(s) {
      given(/a given/,  function() {
      });
    });
  });

  feature(/Feature (D)/, function(f) {
    execution_map.context = execution_map.context || { map: "" };
    execution_map.context.map += f;
    background(/Background/, function() {
      given(/a background/, function() {

      });
    });
    scenario(/Scene ([A-Za-z]+)/, function(s) {
      given(/a given/,  function() {
      });
    });
  });

  errors = run({ showError: true });
  it('with a correct shared execution map', function() {
    /*
    expect(execution_map.context.map).toBe("AB");

    expect(execution_map.context.scenario.map).toBe("ABAB");

    expect(execution_map.context.scenario.given.map).toBe("AACD.ABIJ.BAOP.BBUV.");
    expect(execution_map.context.scenario.when.map).toBe("AAEF.ABKL.BAQR.BBWX.");
    expect(execution_map.context.scenario.then.map).toBe("AAGH.ABMN.BAST.BBYZ.");
    */
    expect(errors.length).toBe(0);
  });
});

