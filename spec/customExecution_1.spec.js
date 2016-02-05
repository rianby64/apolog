'use strict';
// the next test are being performed by using the features from Apolog
var example = [
      './spec/features/customExecutionA.feature',
      './spec/features/customExecutionB.feature',
    ]

describe("Custom nested execution with", function() {
  var execution_map = {}, errors;
  loadFeatures(example);

  errors = run();
  it("features not found", function() {
    expect(errors[0].message).toBe('Feature not found "Custom Execution A"');
    expect(errors[1].message).toBe('Feature not found "Custom Execution B"');
    expect(errors.length).toBe(2);
  });
});

