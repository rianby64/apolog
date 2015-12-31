'use strict';
// the next test are being performed by using the features from Apolog

loadFeature('./spec/features/params.feature');
describe("it parsers a simple feature", function() {
  var execution_map = {},
      errors;

  feature('Testing parameters', function feature() {
    execution_map.feature = execution_map.feature || { count: 0 };
    execution_map.feature.count++;

    background(/A background/, function background() {
      execution_map.background = execution_map.background || { count: 0 };
      execution_map.background.count++;

      given(/a given background ([0-9a-zA-Z]+)/, function given_background(param, table) {
        var expect_table = [
          [ 'x1', 'x2', 'x3' ],
          [ 'y1', 'y2', 'y3' ],
          [ 'z1', 'z2', 'z3' ]
        ];
        expect(param).toMatch(/x[0-9]/);
        expect_table.forEach(function(item, i) {
          expect(table[i]).toEqual(jasmine.arrayContaining(item));
        });
        execution_map.background_given = execution_map.background_given || { count: 0 };
        execution_map.background_given.count++;
      });
    });

    scenario(/Simple scenario ([0-9a-zA-Z]+)/, function scenario(p) {
      execution_map.scenario = execution_map.scenario || { count: 0 };
      execution_map.scenario.count++;
    });
    scenario(/Another scenario ([0-9a-zA-Z]+)/, function() {
      execution_map.another_scenario = execution_map.another_scenario || { count: 0 };
      execution_map.another_scenario.count++;
    });

    given(/A given ([0-9a-zA-Z]+)/, function given(param, table, done) {
      expect(param).toMatch(/x[0-9]/);
      if (param === "x3") {
        expect(table).toBeUndefined();
      }
      else {
        expect(table).toEqual(jasmine.arrayContaining(['m1', 'm2', 'm3']));
      }
      execution_map.given = execution_map.given || { count: 0 };
      execution_map.given.count++;
      done();
    });
    when(/A when ([0-9a-zA-Z]+) ([0-9a-zA-Z]+)/, function when(param1, param2) {
      execution_map.when = execution_map.when || { count: 0 };
      execution_map.when.count++;
    });
    then(/A step ([0-9a-zA-Z]+)/, function then(param1, param2, param3, table, done) {
      var expect_table = [[ 'm1', 'm2', 'm3' ], [ 'n1', 'n2', 'n3' ]];
      if (table) {
        expect_table.forEach(function(item, i) {
          expect(table[i]).toEqual(jasmine.arrayContaining(item));
        });
      }
      
      expect(param2).toBeUndefined();
      expect(param3).toBeUndefined();

      execution_map.then = execution_map.then || { count: 0 };
      execution_map.then.count++;
      done();
    });
  });

  errors = run();

  /*
  it('so "feature" was called', function() {
    expect(execution_map.feature.count).toBe(1);
  });
  it('so "background" was called', function() {
    expect(execution_map.background.count).toBe(2);
  });
  it('so "background given" step was called as normal function', function() {
    expect(execution_map.background_given.count).toBe(2);
  });
  it('so "scenario" was called', function() {
    expect(execution_map.scenario.count).toBe(1);
  });
  it('so "given" was called as async function with done() parameter', function() {
    expect(execution_map.given.count).toBe(1);
  });
  it('so "when" was called as a function*', function() {
    expect(execution_map.when.count).toBe(1);
  });
  it('the then was called as async function* with done() === undefined parameter', function() {
    expect(execution_map.then.count).toBe(1);
  });
  */

  it('running without errors', function() {
    expect(errors.length).toBe(0);
  });
});

