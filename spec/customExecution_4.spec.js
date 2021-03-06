'use strict';
// the next test are being performed by using the features from Apolog

var example = [
      './spec/features/customExecutionA.feature',
      './spec/features/customExecutionB.feature'
    ];

describe("Custom nested execution with", function() {
  var execution_map = {}, errors;
  loadFeature(example[0]);
  loadFeature(example[1]);

  feature("Custom Execution A", function() {
    execution_map.custom_execution_a = execution_map.custom_execution_a || { count: 0 };
    execution_map.custom_execution_a.count++;
    scenario("Scenario A", function() {
      execution_map.custom_execution_a.scenario_a = execution_map.custom_execution_a.scenario_a || { count: 0 };
      execution_map.custom_execution_a.scenario_a.count++;
      given("A given", function() {
        execution_map.custom_execution_a.scenario_a.given = execution_map.custom_execution_a.scenario_a.given || { count: 0 };
        execution_map.custom_execution_a.scenario_a.given.count++;
      });
    });
    scenario("Scenario B", function() {
      execution_map.custom_execution_a.scenario_b = execution_map.custom_execution_a.scenario_b || { count: 0 };
      execution_map.custom_execution_a.scenario_b.count++;
      given("A given", function() {
        execution_map.custom_execution_a.scenario_b.given = execution_map.custom_execution_a.scenario_b.given || { count: 0 };
        execution_map.custom_execution_a.scenario_b.given.count++;
      });
      when("An and", function() {
        execution_map.custom_execution_a.scenario_b.and = execution_map.custom_execution_a.scenario_b.and || { count: 0 };
        execution_map.custom_execution_a.scenario_b.and.count++;
      });
    });
    when("A when", function() {
      execution_map.custom_execution_a.when = execution_map.custom_execution_a.when || { count: 0 };
      execution_map.custom_execution_a.when.count++;
    });
  });

  feature("Custom Execution B", function() {
    execution_map.custom_execution_b = execution_map.custom_execution_b || { count: 0 };
    execution_map.custom_execution_b.count++;
    scenario("Scenario A", function() {
      execution_map.custom_execution_b.scenario_a = execution_map.custom_execution_b.scenario_a || { count: 0 };
      execution_map.custom_execution_b.scenario_a.count++;
      given("A given", function() {
        execution_map.custom_execution_b.scenario_a.given = execution_map.custom_execution_b.scenario_a.given || { count: 0 };
        execution_map.custom_execution_b.scenario_a.given.count++;
      });
    });
    scenario("Scenario B", function() {
      execution_map.custom_execution_b.scenario_b = execution_map.custom_execution_b.scenario_b || { count: 0 };
      execution_map.custom_execution_b.scenario_b.count++;
      given("A given", function() {
        execution_map.custom_execution_b.scenario_b.given = execution_map.custom_execution_b.scenario_b.given || { count: 0 };
        execution_map.custom_execution_b.scenario_b.given.count++;
      });
      when("An and", function() {
        execution_map.custom_execution_b.scenario_b.and = execution_map.custom_execution_b.scenario_b.and || { count: 0 };
        execution_map.custom_execution_b.scenario_b.and.count++;
      });
    });
    when("A when", function() {
      execution_map.custom_execution_b.when = execution_map.custom_execution_b.when || { count: 0 };
      execution_map.custom_execution_b.when.count++;
    });
  });

  scenario("Scenario A", function() {
    execution_map.scenario_a = execution_map.scenario_a || { count: 0 };
    execution_map.scenario_a.count++;
    when("An and", function() {
      execution_map.scenario_a.and = execution_map.scenario_a.and || { count: 0 };
      execution_map.scenario_a.and.count++;
    });
  });
  
  then("A step", function() {
    execution_map.then = execution_map.then || { count: 0 };
    execution_map.then.count++;
  });

  errors = run();
  it('Scenario A that can not be overloaded outside the feature', function() {
    expect(execution_map.custom_execution_a.count).toBe(1);
    expect(execution_map.custom_execution_a.scenario_a.count).toBe(1);
    expect(execution_map.custom_execution_a.scenario_a.given.count).toBe(1);

    expect(execution_map.custom_execution_a.scenario_b.count).toBe(1);
    expect(execution_map.custom_execution_a.scenario_b.given.count).toBe(1);
    expect(execution_map.custom_execution_a.scenario_b.and.count).toBe(1);

    expect(execution_map.custom_execution_a.when.count).toBe(2);

    expect(execution_map.custom_execution_b.count).toBe(1);
    expect(execution_map.custom_execution_b.scenario_a.count).toBe(1);
    expect(execution_map.custom_execution_b.scenario_a.given.count).toBe(1);

    expect(execution_map.custom_execution_b.scenario_b.count).toBe(1);
    expect(execution_map.custom_execution_b.scenario_b.given.count).toBe(1);
    expect(execution_map.custom_execution_b.scenario_b.and.count).toBe(1);

    expect(execution_map.custom_execution_b.when.count).toBe(2);
    expect(execution_map.then.count).toBe(4);

    expect(errors[0].message).toBe('And not found "An and"');
    expect(errors[1].message).toBe('And not found "An and"');
    expect(errors.length).toBe(2);
  });
});

