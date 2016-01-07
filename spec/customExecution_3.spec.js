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
    });
    scenario('Scenario B', function() {
      execution_map.custom_execution_a.scenario_b = execution_map.custom_execution_a.scenario_b || { count: 0 };
      execution_map.custom_execution_a.scenario_b.count++;
    });
  });

  feature('Custom Execution B', function() {
    execution_map.custom_execution_b = execution_map.custom_execution_b || { count: 0 };
    execution_map.custom_execution_b.count++;
    scenario('Scenario A', function() {
      execution_map.custom_execution_b.scenario_a = execution_map.custom_execution_b.scenario_a || { count: 0 };
      execution_map.custom_execution_b.scenario_a.count++;
    });
    scenario('Scenario B', function() {
      execution_map.custom_execution_b.scenario_b = execution_map.custom_execution_b.scenario_b || { count: 0 };
      execution_map.custom_execution_b.scenario_b.count++;
    });
  });

  errors = run();
  it("steps not found", function() {
    expect(execution_map.custom_execution_a.count).toBe(1);
    expect(execution_map.custom_execution_a.scenario_a.count).toBe(1);
    expect(execution_map.custom_execution_a.scenario_b.count).toBe(1);
    expect(execution_map.custom_execution_b.count).toBe(1);
    expect(execution_map.custom_execution_b.scenario_a.count).toBe(1);
    expect(execution_map.custom_execution_b.scenario_b.count).toBe(1);
   
    expect(errors[0].message).toBe('Given not found "A given"');
    expect(errors[1].message).toBe('When not found "A when"');
    expect(errors[2].message).toBe('And not found "An and"');
    expect(errors[3].message).toBe('Then not found "A step"');
    expect(errors[4].message).toBe('Given not found "A given"');
    expect(errors[5].message).toBe('When not found "A when"');
    expect(errors[6].message).toBe('And not found "An and"');
    expect(errors[7].message).toBe('Then not found "A step"');
    expect(errors[8].message).toBe('Given not found "A given"');
    expect(errors[9].message).toBe('When not found "A when"');
    expect(errors[10].message).toBe('And not found "An and"');
    expect(errors[11].message).toBe('Then not found "A step"');
    expect(errors[12].message).toBe('Given not found "A given"');
    expect(errors[13].message).toBe('When not found "A when"');
    expect(errors[14].message).toBe('And not found "An and"');
    expect(errors[15].message).toBe('Then not found "A step"');
    expect(errors.length).toBe(16);
  });
});

