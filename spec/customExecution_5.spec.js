'use strict';
// the next test are being performed by using the features from Apolog
var example = [
      './spec/features/customExecutionA.feature', 
      './spec/features/customExecutionB.feature'
    ]

describe("Custom nested execution with", function() {
  var execution_map = {}, errors;
  loadFeature(example[0]);
  loadFeature(example[1]);

  feature('Custom Execution A', function() {
    execution_map.custom_execution_a = execution_map.custom_execution_a || { count: 0 };
    execution_map.custom_execution_a.count++;
    scenario('Scenario A', function() {
      execution_map.custom_execution_a.scenario_a = execution_map.custom_execution_a.scenario_a || { count: 0 };
      execution_map.custom_execution_a.scenario_a.count++;
      given('A given', function() {
        execution_map.custom_execution_a.scenario_a.given = execution_map.custom_execution_a.scenario_a.given || { count: 0 };
        execution_map.custom_execution_a.scenario_a.given.count++;
      });
    });
    when('A when', function() {
      execution_map.custom_execution_a.when = execution_map.custom_execution_a.when || { count: 0 };
      execution_map.custom_execution_a.when.count++;
    });
    when('An and', function() {
      execution_map.custom_execution_a.anAnd = execution_map.custom_execution_a.anAnd || { count: 0 };
      execution_map.custom_execution_a.anAnd.count++;
    });
  });

  feature('Custom Execution B', function() {
    execution_map.custom_execution_b = execution_map.custom_execution_b || { count: 0 };
    execution_map.custom_execution_b.count++;
    scenario('Scenario A', function() {
      execution_map.custom_execution_b.scenario_a = execution_map.custom_execution_b.scenario_a || { count: 0 };
      execution_map.custom_execution_b.scenario_a.count++;
      given('A given', function() {
        execution_map.custom_execution_b.scenario_a.given = execution_map.custom_execution_b.scenario_a.given || { count: 0 };
        execution_map.custom_execution_b.scenario_a.given.count++;
      });
      given('A step', function() {
        execution_map.custom_execution_b.scenario_a.then = execution_map.custom_execution_b.scenario_a.then || { count: 0 };
        execution_map.custom_execution_b.scenario_a.then.count++;
      });
    });
    when('A when', function() {
      execution_map.custom_execution_b.when = execution_map.custom_execution_b.when || { count: 0 };
      execution_map.custom_execution_b.when.count++;
    });
  });

  when('An and', function() {
    execution_map.anAnd = execution_map.anAnd || { count: 0 };
    execution_map.anAnd.count++;
  });

  then('A step', function() {
    execution_map.then = execution_map.then || { count: 0 };
    execution_map.then.count++;
  });

  errors = run();
  it("overloaded steps", function() {
    expect(execution_map.custom_execution_a.count).toBe(1);
    expect(execution_map.custom_execution_a.scenario_a.count).toBe(1);
    expect(execution_map.custom_execution_a.scenario_a.given.count).toBe(1);
    expect(execution_map.custom_execution_a.anAnd.count).toBe(1);
    expect(execution_map.custom_execution_a.when.count).toBe(1);

    expect(execution_map.custom_execution_b.count).toBe(1);
    expect(execution_map.custom_execution_b.scenario_a.count).toBe(1);
    expect(execution_map.custom_execution_b.scenario_a.given.count).toBe(1);
    expect(execution_map.custom_execution_b.scenario_a.then.count).toBe(1);
    expect(execution_map.custom_execution_b.when.count).toBe(1);

    expect(execution_map.anAnd.count).toBe(1);
    expect(execution_map.then.count).toBe(1);
  });
});

