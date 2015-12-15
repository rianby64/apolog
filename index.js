(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], factory);
  } else if (typeof window === 'object') {
    // Browser globals (root is window)
    window.apolog = factory(isGeneratorFunction);
  } else {
    // Node.js/IO.js
    module.exports = factory();
  }
}(this, function (isGeneratorFunction) {
  'use strict';
  if (!isGeneratorFunction) {
    isGeneratorFunction = require('is-generator').fn
  }
  var CONST_FEATURE = "Feature",
      CONST_SCENARIO = "Scenario",
      CONST_SCENARIOOUTLINE = "ScenarioOutline",
      CONST_BACKGROUND = "Background",
      CONST_STEP = "Step",
      CONST_WHEN = "When",
      CONST_THEN = "Then",
      CONST_GIVEN = "Given",
      featureId = 0,
      backgroundId = 0,
      scenarioId = 0,
      stepId = 0,
      _definitions = {},
      _features = [],
      _parent,
      world = new World(),
      lastId = 0;

  function World() {}

  function setParent(parent) {
    _parent = parent;
  }
  function getParent() {
    return _parent;
  }

  /**
   * Add a definition to the stack.
   * @param {RegExp, String} name - The identificator to match with a defition from .feature content.
   * @param {Function} fn - The function that will be executed.
   * @param {Object} thisArg.
   * @param {String} type - can be one of the values "feature", "scenario" or "step"
   */
  function addDefinition(type, name, fn, thisArg) {
    var definitions,
        id,
        _thisArg = thisArg,
        parent = getParent();

    if ((type === CONST_FEATURE) || (type === CONST_SCENARIO) || (type === CONST_BACKGROUND)) {
      definitions = {};
    }

    if (type === CONST_FEATURE) { id = fn.featureId; }
    else if (type === CONST_SCENARIO) { id = fn.scenarioId; }
    else if (type === CONST_BACKGROUND) { id = fn.backgroundId; }
    else { id = fn.stepId; }

    // Inherits the thisArg context from parent
    if (!_thisArg && parent) {
      _thisArg = parent.thisArg;
    }
    // And if nothing is given, set the world by default
    if (!_thisArg) {
      _thisArg = world;
    }

    if (parent) {
      parent.definitions[lastId] = {
        id: id,
        name: name,
        type: type,
        fn: fn,
        thisArg: _thisArg,
        parent: parent,
        definitions: definitions
      }
    }
    else {
      _definitions[lastId] = {
        id: id,
        name: name,
        type: type,
        fn: fn,
        thisArg: _thisArg,
        parent: undefined,
        definitions: definitions
      }
    }
    lastId++;
  }

  function getDefinitions() {
    return _definitions;
  }

  function addFeature(feature) {
    _features.push(feature)
  }

  function getFeatures() {
    return _features;
  }

  function reset() {
    _definitions = {};
    _features = [];
    _parent = undefined;
    featureId = backgroundId = scenarioId = stepId = 0;
  }

  /**
   * apply definition to describe()
   * @param {object} feature given from .feature
   * @param {function} definitionFn given from .test.js
   * @param {array} args given by matching feature.name with definitionFn.regExp
   */
  function applyDefinition(feature, definition, args) {
    var items, i, l, background,
        currentParent = getParent();

    setParent(definition);
    // TODO> think about describe context being executed async
    definition.fn.apply(definition.thisArg, args);

    if (feature.hasOwnProperty('background')) {
      feature.background.file = feature.file;
      background = feature.background;
    }
    if (feature.hasOwnProperty('scenarioDefinitions')) {
      items = feature.scenarioDefinitions;
      l = items.length;
      for (i = 0; i < l; i++) {
        items[i].file = feature.file;
        processDefinition(items[i], background);
      }
    }
    else if (feature.hasOwnProperty('steps')) {
      items = feature.steps;
      l = items.length;
      for (i = 0; i < l; i++) {
        items[i].file = feature.file;
        processStep(items[i]);
      }
    }
    
    setParent(currentParent);
  }

  /**
   * applying (object)feature.name against the regexp (feature)definition.(regexp)name
   * in order to define the args and define the fn
   * @param {object} feature - a feature from parsing the .feature file
   * @param {object} definition - a definition given by using feature(regexp|string, function)
   * @return {function} definitionFn, {array}args
   */
  function match(feature, definition) {
    var result, args,
        feature_type = feature.type;
    if (feature_type === CONST_SCENARIOOUTLINE) {
      console.log(feature.examples);
      console.log("SCENARIO OUTLINE not ready yet... coming soon");
      // feature_type = CONST_SCENARIO;
    }

    if (feature_type !== definition.type) {
      return;
    };
    if (definition.name.constructor === RegExp) {
      args = definition.name.exec(feature.name);
      if (args) { // the given regexp seems to fit the feature.name
        // seems that I need to study how to match strings to regexp
        if (args[0] === feature.name) { // because here I do an strange comparison
          args = args.slice(1); // and then eliminate the first element
        }
        result = definition;
      }
    }
    // just define the fn
    else if (definition.name.constructor === String) {
      if (definition.name === feature.name) {
        result = definition;
        args = [];
      }
    }
    // show error if nothing was found
    else {
      console.error('undefined type to identify the ' + feature.type + '"' + feature.name + '"' + ". This should be a regexp or an string object");
    }

    if (result) {
      return {
        definition: result,
        args: args
      };
    }
    return;
  }

  function processStep(step) {
    var parent = getParent(),
        definitions = parent.definitions,
        item, args, definitionFn, result;

    function enveloperAsync(done) {
      args.push(done); // TODO> is this enough? check the way to pass last arg to definitionFn
      definitionFn.apply(result.definition.thisArg, args);
    }

    function* coenveloperAsync(done) {
      args.push(done); // TODO> is this enough? check the way to pass last arg to definitionFn
      yield* definitionFn.apply(result.definition.thisArg, args);
    }

    function enveloper() {
      definitionFn.apply(result.definition.thisArg, args);
    }

    function* coenveloper() {
      yield* definitionFn.apply(result.definition.thisArg, args);
    }

    // Search process
    while (true) {
      for (item in definitions) {
        step.name = step.text;
        result = match(step, definitions[item]);

        if (result) {
          break;
        }
      }
      if (!parent || result) {
        break;
      }
      parent = parent.parent;
      if (!parent) {
        definitions = getDefinitions();
      }
      else {
        definitions = parent.definitions;
      }
    }

    if (result) { // if definitionFn found
      definitionFn = result.definition.fn;
      args = result.args;
      if (args.length < definitionFn.length) {
        if (isGeneratorFunction(definitionFn)) {
          it(step.text, coenveloperAsync);
        }
        else {
          it(step.text, enveloperAsync); // send to it the final version for definitionFn enveloped into an enveloper
        }
      }
      else {
        if (isGeneratorFunction(definitionFn)) {
          it(step.text, coenveloper); // send to it the final version for definitionFn enveloped into an enveloper
        }
        else {
          it(step.text, enveloper); // send to it the final version for definitionFn enveloped into an enveloper
        }
      }
      return;
    }
    // If no definition matchet at all
    else {
      // TODO> make the standard format for this warning
      // TODO> take in count the info given at definition.location
      console.error(step.type + ' not found "' + step.name + '" at ' + step.file.path);
    }
  }

  function processDefinition(definition, background) {
    var definitions, item, args, definitionFn, result, parent = getParent();

    if (parent) {
      definitions = parent.definitions;
    }
    else {
      definitions = getDefinitions();
    }

    while (true) {
      for (item in definitions) {
        result = match(definition, definitions[item]);

        if (result) {
          break;
        }
      }
      if (!parent || result) {
        break;
      }
      definitions = getDefinitions();
      parent = undefined;
    }
    // if definitionFn found
    if (result) {
      if (background) {
        processDefinition(background);
      }
      describe(definition.name, function() {
        applyDefinition(definition, result.definition, result.args);
      });
    }
    // If no definition matchet at all
    else {
      // TODO> make the standard format for this warning
      // TODO> take in count the info given at definition.location
      console.error(definition.type + ' not found "' + definition.name + '" at ' + definition.file.path);
    }
  }

  function run() {
    var features = getFeatures(),
        l = features.length,
        i;

    for (i = 0; i < l; i++) {
      processDefinition(features[i]);
    }
    reset();
  }

  function loadFeature(feature, file) {
    var _feature = feature || {},
        Gherkin, parser;

    // Be careful with this comparision. I'm assuming that programm is running in nodeJS environment
    if (feature.constructor === String) {
      Gherkin = require('gherkin');
      parser = new Gherkin.Parser();
      _feature = parser.parse(feature);
    }

    _feature.file = file || {};
    addFeature(_feature);
  };

  function feature(name, fn, thisArg) {
    fn.featureId = ++featureId;
    return addDefinition(CONST_FEATURE, name, fn, thisArg);
  };

  function background(name, fn, thisArg) {
    fn.backgroundId = ++backgroundId;
    return addDefinition(CONST_BACKGROUND, name, fn, thisArg);
  };

  function scenario(name, fn, thisArg) {
    fn.scenarioId = ++scenarioId;
    return addDefinition(CONST_SCENARIO, name, fn, thisArg);
  };

  function step(name, fn, thisArg) {
    fn.stepId = ++stepId;
    return addDefinition(CONST_STEP, name, fn, thisArg);
  };

  function given(name, fn, thisArg) {
    fn.stepId = ++stepId;
    return addDefinition(CONST_STEP, name, fn, thisArg);
  };

  function when(name, fn, thisArg) {
    fn.stepId = ++stepId;
    return addDefinition(CONST_STEP, name, fn, thisArg);
  };

  function then(name, fn, thisArg) {
    fn.stepId = ++stepId;
    return addDefinition(CONST_STEP, name, fn, thisArg);
  };

  return {
    feature: feature, 
    background: background,
    scenario: scenario,
    step: step,
    given: given,
    when: when,
    then: then,
    loadFeature: loadFeature,
    run: run
  };

}));
