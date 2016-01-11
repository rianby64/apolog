'use strict';
// the next test are being performed by using the features from Apolog
describe("Step overdefined", function() {
  var errors;
  loadFeature('./spec/features/overdefined.feature');

  feature(/Simple Feature/, function() {
    background(/A background/, function() {
      given(/a given background/, function() {
        given("no matter what", function() { }); // has no sense
      });
    });
    scenario(/Simple scenario/, function() {
      given(/A given/, function() {
        given("no matter what", function() { }); // has no sense
      });
    });
  });
  errors = run();

  it('runs without errors', function() {
    expect(errors.length).toBe(0);
  });
});

