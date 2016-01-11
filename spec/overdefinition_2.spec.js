'use strict';
// the next test are being performed by using the features from Apolog
describe("Scenario overdefined", function() {
  var errors;
  loadFeature('./spec/features/overdefined.feature');

  feature(/Simple Feature/, function() {
    background(/A background/, function() {
      //scenario("no matter what", function() { });
      given(/a given background/, function() {
        scenario("no matter what", function() { });
      });
    });
    scenario(/Simple scenario/, function() {
      //scenario("no matter what", function() { });
      given(/A given/, function() {
        scenario("no matter what", function() { });
      });
    });
  });
  errors = run();

  it('runs without errors', function() {
    expect(errors.length).toBe(0);
  });
});

