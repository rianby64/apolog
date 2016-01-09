'use strict';
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
