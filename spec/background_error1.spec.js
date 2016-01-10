'use strict';
// the next test are being performed by using the features from Apolog

describe("Background definition", function() {
  var execution_map = {}, errors;
  loadFeature('./spec/features/backgroundA.feature');
  
  feature(/Feature (A)/, function(f) {
    background(/Background/, function() { });
    it('by not allowing two backgrounds inside a feature', function() {
      var twoBackgrounds = function() { 
        background(function() { console.log('background2'); });
      }
      expect(twoBackgrounds).toThrow();
    });
    scenario(/Scene ([A-Za-z]+)/, function(s) { });
  });
  run();

  it('but throwing an exception if defining an unnamed backgroud', function() {
    var unnamedBackgroud = function() {
      background(function() { });
    };
    expect(unnamedBackgroud).toThrow();
  });

  it('runs for nothing for cleaning up', function() {
    errors = run();
    expect(errors.length).toBe(0);
  });
});

