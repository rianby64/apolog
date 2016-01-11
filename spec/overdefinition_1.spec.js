'use strict';
// the next test are being performed by using the features from Apolog
describe("Feature overdefined", function() {
  var errors;
  loadFeature('./spec/features/overdefined.feature');

  feature(/Simple Feature/, function() {
    background(/A background/, function() {
      //feature("No matter what", function() { });
      given(/a given background/, function() {
        feature("No matter what", function() { }); // has no sense
      });
    });
    scenario(/Simple scenario/, function() {
      //feature("No matter what", function() { });
      given(/A given/, function() {
        feature("No matter what", function() { }); // has no sense
      });
    });
    //feature("No matter what", function() { });
  });
  errors = run();

  it('runs without errors', function() {
    expect(errors.length).toBe(0);
  });
});

