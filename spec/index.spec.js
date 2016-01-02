'use strict';

/** TODO> Include some test for lib/js
 * For example:
 *  - do not accept recursive features, scenarios nor steps!
 */

/**
 * One added a Definition must know who is calling it, and when the runner is the caller then its parent is null
 *  Example:
 *
feature('name1', function featureName1() {
  feature('incorrectEmbeddedFeature1', function incorrectEmbeddedFeature1() { }); // not allowed
  scenario('name2', function scenarioName2() {
    feature('incorrectEmbeddedFeature2', function incorrectEmbeddedFeature2() { }); // not allowed
    scenario('incorrectEmbeddedScenario1', function incorrectEmbeddedScenario1() { }); // not allowed
    step('name3', function stepName3() {
      feature('incorrectEmbeddedFeature3', function incorrectEmbeddedFeature3() { }); // not allowed
      scenario('incorrectEmbeddedScenario2', function incorrectEmbeddedScenario2() { }); // not allowed
      step('incorrectEmbeddedStep1', function incorrectEmbeddedStep1() { }); // not allowed
    }); // stepName3.caller = { fn: scenarioName2, type: 'scenario' }
  }); // scenarioName2.caller = { fn: featureName1, type: 'feature' } // [[this definition can be step too]]
}); // featureName1.caller = null // [[this definition can be scenario or step too]]
 */
var apolog = require('../index.js');
describe("The construction of embedded definitions", function() {
  describe("Has an interface that", function() {
    it("contains> feature(name, fn, thisArg)", function() {
      expect(feature instanceof Function).toBe(true);
      expect(feature.length).toBe(3);
    });
    it("contains> background(name, fn, thisArg)", function() {
      expect(background instanceof Function).toBe(true);
      expect(feature.length).toBe(3);
    });
    it("contains> scenario(name, fn, thisArg)", function() {
      expect(scenario instanceof Function).toBe(true);
      expect(scenario.length).toBe(3);
    });
    it("contains> step(name, fn, thisArg)", function() {
      expect(step instanceof Function).toBe(true);
      expect(step.length).toBe(3);
    });
    it("contains> given(name, fn, thisArg)", function() {
      expect(given instanceof Function).toBe(true);
      expect(given.length).toBe(3);
    });
    it("contains> when(name, fn, thisArg)", function() {
      expect(when instanceof Function).toBe(true);
      expect(when.length).toBe(3);
    });
    it("contains> then(name, fn, thisArg)", function() {
      expect(then instanceof Function).toBe(true);
      expect(then.length).toBe(3);
    });
    it("contains> definitions()", function() {
      expect(apolog.loadFeature instanceof Function).toBe(true);
      expect(apolog.loadFeature.length).toBe(2);
    });
    it("contains> run()", function() {
      expect(run instanceof Function).toBe(true);
      expect(run.length).toBe(0);
    });
  });

});
