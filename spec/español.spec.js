'use strict';
// the next test are being performed by using the features from Apolog

loadFeature('./spec/features/español.feature');
describe("it parsers an spanish feature", function() {
  var execution_map = {},
      errors;

  feature('La posibilidad de escribir en español', function () {
    background('Que se ejecutan antes de la escena', function () {
      given('un antecedente', function () {

      });
      and('unas ideas', function () {

      });
      and('intencionalmente otras ideas', function () {

      });
    });
    given('un tema', function () {

    });
    when('ejecuto ésto de aquí', function () {

    });
    then(/obtengo un escenario en español (.*)/, function (tipoEscenario) {

    });
    scenario('Describir una escena simple', function scenario() {
      given('una tarea', function() {

      });
      given('unos datos', function() {

      });
      given('unas ideas', function() {

      });
    });
    scenario(/Describir una escena (.*)/, function(tipoEscena) {
      given('another given', function() {

      });
      when('another when', function() {

      });
      then('another step', function() {

      });
      but('Al ejecutar ésto otro', function() {

      });
      then('obtengo un escenario mucho mejor', function() {

      });
    });
  });

  errors = run();
  it('running without errors', function() {
    expect(errors.length).toBe(0);
  });
});

