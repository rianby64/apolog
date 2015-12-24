'use strict';
// the next test are being performed by using the features from Apolog

var apolog = require('../index.js'),
    feature = apolog.feature,
    scenario = apolog.scenario,
    given = apolog.given,
    when = apolog.when,
    then = apolog.then,
    loadFeature = apolog.loadFeature,
    run = apolog.run,
    fs = require('fs'),
    example = [{
      file: {
        path: 'customExecutionA.feature'
      },
      content: fs.readFileSync('./spec/features/customExecutionA.feature', 'utf8')
    }, {
      file: {
        path: 'customExecutionB.feature'
      },
      content: fs.readFileSync('./spec/features/customExecutionB.feature', 'utf8')
    }]

describe("Custom nested execution for two features", function() {
  var execution_map = {}, errors;
  loadFeature(example[0].content, example[0].file);
  loadFeature(example[1].content, example[1].file);

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

  it('Scenario A cannot be overloaded outside of the feature', function() {
    expect(execution_map.custom_execution_a.count).toBe(1);
    expect(execution_map.custom_execution_a.scenario_a.count).toBe(1);
    expect(execution_map.custom_execution_a.scenario_a.given.count).toBe(1);
    expect(execution_map.custom_execution_a.when.count).toBe(1);

    expect(execution_map.custom_execution_b.count).toBe(1);
    expect(execution_map.custom_execution_b.scenario_a.count).toBe(1);
    expect(execution_map.custom_execution_b.scenario_a.given.count).toBe(1);
    expect(execution_map.custom_execution_b.when.count).toBe(1);

    expect(execution_map.then.count).toBe(2);

    expect(errors[0].message).toBe('Step not found "An and"');
    expect(errors[1].message).toBe('Step not found "An and"');
  });
});

