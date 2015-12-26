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
    execution_map.custom_execution_a = execution_map.custion_execution_a || { count: 0 };
    execution_map.custom_execution_a.count++;
  });

  feature('Custom Execution B', function() {
    execution_map.custom_execution_b = execution_map.custion_execution_b || { count: 0 };
    execution_map.custom_execution_b.count++;
  });

  errors = run();
  it("scenarios not found", function() {
    expect(execution_map.custom_execution_a.count).toBe(1);
    expect(execution_map.custom_execution_b.count).toBe(1);
    
    expect(errors[0].message).toBe('Scenario not found "Scenario A"');
    expect(errors[1].message).toBe('Scenario not found "Scenario B"');
    expect(errors[2].message).toBe('Scenario not found "Scenario A"');
    expect(errors[3].message).toBe('Scenario not found "Scenario B"');
    expect(errors.length).toBe(4);
  });
});

