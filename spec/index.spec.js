'use strict';

var apolog = require('../index.js'),
    fs = require('fs'),
    FEATURE = "Feature",
    BACKGROUND = "Background",
    SCENARIOOUTLINE = "ScenarioOutline",
    SCENARIO = "Scenario",
    STEP = "Step",
    WHEN = "When",
    THEN = "Then",
    GIVEN = "Given";

/** TODO> Include some test for lib/apolog.js
 * For example:
 *  - load the module into an environment that already has a apolog variable defined
 *  - test if feature, scenario, step's name like string are being matched with a test definition
 *  - test if feature, scenario, step's name like regexp are being matched with a test definition
 *  - test the expected behavoiur>
 *     if a feature(...) contains an scenario and in another place an scenario was written as stand-alone definition
 *     then the stand-alone definition becomes a global definition and the scenario inside the feature belongs
 *     to the feature
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

apolog.definitions = {
  0: {
    fn: featureName1,
    name: 'name1',
    type: 'feature',
    definitions: {
      0: {
        fn: scenarioName1,
        name: 'name1',
        type: 'scenario',
        definitions: {
          0: {
            fn: stepName1,
            name: 'name1',
            type: 'step'
            // definitions is undefined
          },
          1: {
            fn: stepName2,
            name: 'name2',
            type: 'step'
            // definitions is undefined
          }
        }
      },
      1: {
        fn: scenarioName1,
        name: 'name1',
        type: 'scenario',
        definitions: {}
      }
    }
  },
  1: {
    fn: featureName1,
    name: 'name2',
    type: 'feature',
      apolog.reset();
      apolog.reset();
    definitions: {}
  }
} // after running the feature-driven process
 *
 */
describe("The construction of embedded definitions", function() {
  describe("Has an interface that", function() {
    it("contains> feature(name, fn, thisArg)", function() {
      expect(apolog.feature instanceof Function).toBe(true);
      expect(apolog.feature.length).toBe(3);
    });
    it("contains> background(name, fn, thisArg)", function() {
      expect(apolog.background instanceof Function).toBe(true);
      expect(apolog.feature.length).toBe(3);
    });
    it("contains> scenario(name, fn, thisArg)", function() {
      expect(apolog.scenario instanceof Function).toBe(true);
      expect(apolog.scenario.length).toBe(3);
    });
    it("contains> step(name, fn, thisArg)", function() {
      expect(apolog.step instanceof Function).toBe(true);
      expect(apolog.step.length).toBe(3);
    });
    it("contains> given(name, fn, thisArg)", function() {
      expect(apolog.given instanceof Function).toBe(true);
      expect(apolog.given.length).toBe(3);
    });
    it("contains> when(name, fn, thisArg)", function() {
      expect(apolog.when instanceof Function).toBe(true);
      expect(apolog.when.length).toBe(3);
    });
    it("contains> then(name, fn, thisArg)", function() {
      expect(apolog.then instanceof Function).toBe(true);
      expect(apolog.then.length).toBe(3);
    });
    it("contains> definitions()", function() {
      expect(apolog.loadFeature instanceof Function).toBe(true);
      expect(apolog.loadFeature.length).toBe(2);
    });
    it("contains> run()", function() {
      expect(apolog.run instanceof Function).toBe(true);
      expect(apolog.run.length).toBe(0);
    });
  });

  describe("can correctly process a simple feature so", function() {
    var example = {
      file: {
        path: 'simpleFeature.feature'
      },
      content: fs.readFileSync('./spec/simpleFeature.feature', 'utf8')
    };

    beforeEach(function() {
      apolog.loadFeature(example.content, example.file);
    });

    it("calls feature function", function(done) {
      var functions = {
        feature: function featureFn() {
          apolog.scenario('Simple scenario', function() { });
          done();
        }
      }
      apolog.feature('Simple Feature', functions.feature);
      apolog.run();
    });

    it("calls scenario and background functions", function(done) {
      var functions = {
        given: function given() { },
        when: function when() { },
        then: function then() { },
        givenBackground: function givenBackground() { },
        scenario: function scenarioFn() {
          apolog.given('A given', functions.given);
          apolog.when('A when', functions.when);
          apolog.then('A step', functions.then);
          
          expect(functions.background).toHaveBeenCalled();
          expect(functions.background.calls.count()).toBe(1);
          done();
        },
        background: function backgroundFn() {
          apolog.given('a given background', functions.givenBackground);
        }
      };
      apolog.feature('Simple Feature', function() {
        apolog.background('A background', functions.background);
        apolog.scenario('Simple scenario', functions.scenario);
      });
      
      spyOn(functions, 'scenario').and.callThrough();
      spyOn(functions, 'background').and.callThrough();
      spyOn(functions, 'givenBackground').and.callThrough();
      
      apolog.run();
    });

  });

});
