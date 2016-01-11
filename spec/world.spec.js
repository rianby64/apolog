'use strict';
// the next test are being performed by using the features from Apolog
describe("World not by default", function() {
  var errors, customWorld = { customWorld: true };
  loadFeature('./spec/features/world.feature');

  feature(/World Feature/, function() {
    var feature_world = this;
    it('must have the custom world', function() {
      expect(feature_world).toEqual(jasmine.objectContaining(customWorld));
    });
    background(/A background/, function() {
      var background_world = this;
      it('must have the custom world', function() {
        expect(background_world).toEqual(jasmine.objectContaining(customWorld));
      });
      given(/a given background/, function() {
        expect(this).toEqual(jasmine.objectContaining(customWorld));
      });
    });
    scenario(/Simple scenario/, function() {
      var simple_scenario_world = this;
      it('must have the custom world', function() {
        expect(simple_scenario_world).toEqual(jasmine.objectContaining(customWorld));
      });
      given(/A given/, function() {
        expect(this).toEqual(jasmine.objectContaining(customWorld));
      });
    });
  }, customWorld);

  scenario(/Another scenario/, function() {
    var another_scenario_world = this;
    it('must have the default world', function() {
      expect(another_scenario_world).not.toEqual(jasmine.objectContaining(customWorld));
      expect(another_scenario_world.constructor.name).toEqual("World");
    });
    given(/A given/, function() {
      expect(this).not.toEqual(jasmine.objectContaining(customWorld));
      expect(this.constructor.name).toEqual("World");
    });
  });
  errors = run();

  it('runs without errors', function() {
    expect(errors.length).toBe(0);
  });
});

