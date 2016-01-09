'use strict';
// the next test are being performed by using the features from Apolog

var example = [
      './spec/features/backgroundA.feature',
      './spec/features/backgroundB.feature',
      './spec/features/backgroundC.feature',
      './spec/features/backgroundD.feature',
      './spec/features/backgroundE.feature'
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

  feature(/Feature (B)/, function(f) {
    execution_map.feature_b = execution_map.feature_b || { map: "" };
    execution_map.feature_b.map += "[" + f + "]";
    background(function() {
      given(/a background/, function() {
        execution_map.feature_b.map += "[bg]";
      });
    });
    scenario(/Scene ([A-Za-z]+)/, function(s) {
      execution_map.feature_b.map += s;
      given(/a given/,  function() {
        execution_map.feature_b.map += "[g" + s + "]";
      });
    });
  });

  background(/Background C/, function() {
    given(/a background/, function() {
      execution_map.feature_c.map += "[bg]";
    });
  });
  feature(/Feature (C)/, function(f) {
    execution_map.feature_c = execution_map.feature_c || { map: "" };
    execution_map.feature_c.map += "[" + f + "]";
    scenario(/Scene ([A-Za-z]+)/, function(s) {
      execution_map.feature_c.map += s;
      given(/a given/,  function() {
        execution_map.feature_c.map += "[g" + s + "]";
      });
    });
  });

  feature(/Feature (D)/, function(f) {
    execution_map.feature_d = execution_map.feature_d || { map: "" };
    execution_map.feature_d.map += "[" + f + "]";
    background(function() {
      given(/a background/, function() {
        execution_map.feature_d.map += "[bg]";
      });
    });
    scenario(/Scene ([A-Za-z]+)/, function(s) {
      execution_map.feature_d.map += s;
      given(/a given/,  function() {
        execution_map.feature_d.map += "[g" + s + "]";
      });
    });
  });

  // TODO: How to test that this definition throws an Error?
  //background(function() {
    // this should be an error
  //});

  feature(/Feature (E)/, function(f) {
    execution_map.feature_e = execution_map.feature_e || { map: "" };
    execution_map.feature_e.map += "[" + f + "]";
    background(/Background/, function() {
      given(/a background/, function() {
        execution_map.feature_e.map += "[bgD]";
      });
    });
    background(function() {
      given(/a background/, function() {
        execution_map.feature_e.map += "[bg]";
      });
    });
    scenario(/Scene ([A-Za-z]+)/, function(s) {
      execution_map.feature_e.map += s;
      given(/a given/,  function() {
        execution_map.feature_e.map += "[g" + s + "]";
      });
    });
  });


  errors = run();
  it('with a correct shared execution map', function() {
    expect(execution_map.feature_a.map).toBe("[A]ABC[bg][gA][bg][gB][bg][gC]");
    expect(execution_map.feature_b.map).toBe("[B]ABC[bg][gA][bg][gB][bg][gC]");
    expect(execution_map.feature_c.map).toBe("[C]ABC[bg][gA][bg][gB][bg][gC]");
    expect(execution_map.feature_d.map).toBe("[D]ABC[bg][gA][bg][gB][bg][gC]");
    expect(errors.length).toBe(0);
  });
});

