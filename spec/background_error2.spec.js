'use strict';
// the next test are being performed by using the features from Apolog

describe("Background definition", function() {
  var execution_map = {}, errors;
  loadFeature('./spec/features/backgroundA.feature');
  
  feature(/Feature (A)/, function(f) {
    background(/Background/, function() { });
    scenario(/Scene ([A-Za-z]+)/, function(s) {
      it('not allowing a background inside an scenario', function() {
        var backgroundInsideScenario = function() {
          background(function() { });
        };
        expect(backgroundInsideScenario).toThrow();
      });
    });
  });
  run();

  it('runs for nothing for cleaning up', function() {
    errors = run();
    expect(errors.length).toBe(0);
  });
});

