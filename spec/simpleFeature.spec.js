'use strict';
// the next test are being performed by using the features from Apolog

loadFeature('./spec/features/simpleFeature.feature');
describe("it parsers a simple feature", function() {
  var execution_map = {},
      errors;

  feature('Simple Feature', function feature() {
    execution_map.feature = execution_map.feature || { count: 0 };
    execution_map.feature.count++;

    background('A background', function background() {
      execution_map.background = execution_map.background || { count: 0 };
      execution_map.background.count++;
      
      given('a given background', function given_background() {
        execution_map.background_given = execution_map.background_given || { count: 0 };
        execution_map.background_given.count++;
      });
    });
    scenario('Simple scenario', function scenario() {
      execution_map.scenario = execution_map.scenario || { count: 0 };
      execution_map.scenario.count++;

      given('A given', function given(done) {
        execution_map.given = execution_map.given || { count: 0 };
        execution_map.given.count++;
        done();
      });

      when('A when', function* when() {
        execution_map.when = execution_map.when || { count: 0 };
        execution_map.when.count++;
        yield {};
      });

      then('A step', function* then(done) {
        execution_map.then = execution_map.then || { count: 0 };
        execution_map.then.count++;
        // If you use async context with a generator* then the done param is undefined
        // Sounds like "Rise Up". So, generator has higher priority than async
        expect(done).toBe(undefined);
        yield {};
      });
    });
    scenario('Another scenario', function() {
      given('another given', function() {

      });
      when('another when', function() {

      });
      then('another step', function() {

      });
    });
  });

  errors = run();

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
  it('running without errors', function() {
    expect(errors.length).toBe(0);
  });
});

