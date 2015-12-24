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

describe("Custom nested execution with no features", function() {
  var execution_map = {}, errors;
  loadFeature(example[0].content, example[0].file);
  loadFeature(example[1].content, example[1].file);

  feature('Custom Execution A', function() {
    execution_map.custom_execution_a = execution_map.custom_execution_a || { count: 0 };
    execution_map.custom_execution_a.count++;
    scenario('Scenario A', function() {
      execution_map.custom_execution_a.scenario_a = execution_map.custom_execution_a.scenario_a || { count: 0 };
      execution_map.custom_execution_a.scenario_a.count++;
    });
  });

  feature('Custom Execution B', function() {
    execution_map.custom_execution_b = execution_map.custom_execution_b || { count: 0 };
    execution_map.custom_execution_b.count++;
    scenario('Scenario A', function() {
      execution_map.custom_execution_b.scenario_a = execution_map.custom_execution_b.scenario_a || { count: 0 };
      execution_map.custom_execution_b.scenario_a.count++;
    });
  });

  errors = run();
  it("steps not found", function() {
    expect(execution_map.custom_execution_a.count).toBe(1);
    expect(execution_map.custom_execution_a.scenario_a.count).toBe(1);
    expect(execution_map.custom_execution_b.count).toBe(1);
    expect(execution_map.custom_execution_b.scenario_a.count).toBe(1);
    
    expect(errors[0].message).toBe('Step not found "A given"');
    expect(errors[1].message).toBe('Step not found "A when"');
    expect(errors[2].message).toBe('Step not found "An and"');
    expect(errors[3].message).toBe('Step not found "A step"');
    expect(errors[4].message).toBe('Step not found "A given"');
    expect(errors[5].message).toBe('Step not found "A when"');
    expect(errors[6].message).toBe('Step not found "An and"');
    expect(errors[7].message).toBe('Step not found "A step"');
  });
});

