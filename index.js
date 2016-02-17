(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', 'gherkin'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('gherkin'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.gherkin);
    global.apolog = mod.exports;
  }
})(this, function (exports, _gherkin) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.setup = setup;
  exports.run = run;
  exports.loadFeature = loadFeature;
  exports.feature = feature;
  exports.background = background;
  exports.scenario = scenario;
  exports.step = step;
  exports.given = given;
  exports.when = when;
  exports.then = then;
  exports.and = and;
  exports.but = but;

  var Gherkin = _interopRequireWildcard(_gherkin);

  function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
      return obj;
    } else {
      var newObj = {};

      if (obj != null) {
        for (var key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
        }
      }

      newObj.default = obj;
      return newObj;
    }
  }

  var FEATURE = "Feature",
      SCENARIO = "Scenario",
      SCENARIOOUTLINE = "ScenarioOutline",
      BACKGROUND = "Background",
      STEP = "Step",
      OPEN_PLACEHOLDER = "<",
      CLOSE_PLACEHOLDER = ">",
      _definitions = {},
      _features = [],
      _parent,
      world = new World(),
      lastId = 0,
      setupOnce_passed = false,
      throwErrors_flag = false,
      // by default DON'T throw error
  bdd_functions = {
    it: undefined,
    describe: undefined
  },
      parserFn;

  /**
   * Taken from https://github.com/blakeembrey/is-generator
   * to avoid it as a dependency
   * Check whether a function is generator.
   *
   * @param  {Function} fn
   * @return {Boolean}
   */
  function isGeneratorFunction(fn) {
    return typeof fn === 'function' && fn.constructor && fn.constructor.name === 'GeneratorFunction';
  }

  /**
   * TODO: Add documentation for this function
   */
  function World() {}

  /**
   * TODO: Add documentation for this function
   */
  function setParent(parent) {
    _parent = parent;
  }

  /**
   * TODO: Add documentation for this function
   */
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
        _thisArg = thisArg,
        parent = getParent(),
        hasBackground = false;

    if (type === FEATURE || type === SCENARIO || type === BACKGROUND) {
      definitions = {};
    }

    // Inherits the thisArg context from parent
    if (!_thisArg && parent) {
      _thisArg = parent.thisArg;
    }
    // And if nothing is given, set the world by default
    if (!_thisArg) {
      _thisArg = world;
    }

    if (parent) {
      if (type === BACKGROUND) {
        if (parent.type !== FEATURE) {
          throw new Error("Can't define a background in a different place than a feature");
        }
        for (var i in parent.definitions) {
          if (parent.definitions[i].type === BACKGROUND) {
            hasBackground = true;
            break;
          }
        }
        if (hasBackground) {
          throw new Error("Can't define two or more backgrounds inside a feature");
        }
      } else if (type === FEATURE) {
        throw new Error("Can't define a feature inside any other definition");
      } else if (type === SCENARIO && (parent.type === STEP || parent.type === BACKGROUND || parent.type === SCENARIO)) {
        throw new Error("Can't define an scenario inside any scenario nor background neither step");
      }
      parent.definitions[lastId] = {
        name: name,
        type: type,
        fn: fn,
        thisArg: _thisArg,
        parent: parent,
        definitions: definitions,
        executed: false
      };
    } else {
      if (type === BACKGROUND && name === undefined) {
        throw new Error("Can't define an unnamed background as general definition");
      }
      _definitions[lastId] = {
        name: name,
        type: type,
        fn: fn,
        thisArg: _thisArg,
        parent: undefined,
        definitions: definitions
      };
    }
    lastId++;
  }

  /**
   * TODO: Add documentation for this function
   */
  function getDefinitions() {
    return _definitions;
  }

  /**
   * TODO: Add documentation for this function
   */
  function addFeature(feature) {
    _features.push(feature);
  }

  /**
   * TODO: Add documentation for this function
   */
  function getFeatures() {
    return _features;
  }

  /**
   * TODO: Add documentation for this function
   */
  function reset() {
    _definitions = {};
    _features = [];
    _parent = undefined;
    lastId = 0;
    world = new World();
  }

  /**
   * Setup BDD functions 'Dialect' for testing
   * @param {object} config Holds definitions 'describe' and 'it'
   */
  function setupDialect(config) {
    var config = config || {};
    if (config.it instanceof Function && config.describe instanceof Function) {
      bdd_functions.it = config.it;
      bdd_functions.describe = config.describe;
    } else {
      // Default action
      try {
        setupDialect({ it: it, describe: describe });
        return;
      } catch (e) {
        reset();
        throw e;
      }
      throw new Error("Definitions for 'describe' and 'it' are not present in the config. Install a BDD framework in order to test");
    }
  }

  /**
   * Setup the parser that will process the text given when loading features
   * And if no parser provided then set a parser by default from Gherkin
   * @param {object} parser Holds the function that parses the string into a Gherkin-object
   */
  function setupParser(parser) {
    if (parser) {
      parserFn = parser;
    } else {
      if (Gherkin.Parser) {
        parserFn = new Gherkin.Parser().parse;
      }
    }
  }

  /**
   * In order to setup Apolog cfg param should have the following attributes
   *   bdd: { it: function, describe: function }
   *   parser: function
   *   throwErrors: boolean - throw instead of return them
   * Be sure that it and describe are functions that behaves in the expected way
   * and also parser function accepts an string and returns a Gherkin-Object
   * @param {object} cfg Has the config attributes to setup
   */
  function setup(cfg) {
    setupOnce_passed = true;
    if (!cfg) {
      // run setup by default
      setupParser();
      setupDialect();
      return;
    }
    if (cfg.parser) {
      setupParser(cfg.parser);
    }
    if (cfg.bdd) {
      setupDialect(cfg.bdd);
    }
    if (cfg.hasOwnProperty('throwErrors')) {
      throwErrors_flag = cfg.throwErrors;
    }
  }

  /**
   * Performs a setup process once
   */
  function defaultSetupOnce() {
    if (setupOnce_passed) {
      return;
    }
    setup();
  }

  /**
   * interpolates a row string that contains some <placeholders> with an example object
   * e.g. row = "<placeholder1> <placeholder2>" and
   *      example = { placeholder1: "value1", placeholder2: "value2" }
   * then the result must be "value1 value2"
   * @param {string} row is the text that contains some <placeholders>
   * @param {object} example is the object that holds some <placeholders> as attributes
   */
  function applyRow(row, example) {
    var result = row,
        key,
        value;
    for (key in example) {
      value = example[key];
      result = result.replace(OPEN_PLACEHOLDER + key + CLOSE_PLACEHOLDER, value);
    }
    return result;
  }

  /**
   * extracts from a (TableRow) row it's values
   * and returns a value containing the values
   * @param {object} row is the object TableRow from Gherkin3
   * @param {object} headers is the optional param that describes each column name
   */
  function parseRow(row, headers) {
    var m = row.cells.length,
        result = {},
        j;
    if (!headers) {
      result = [];
    }
    for (j = 0; j < m; j++) {
      if (headers) {
        result[headers[j]] = row.cells[j].value;
      } else {
        result.push(row.cells[j].value);
      }
    }
    return result;
  }

  /**
   * apply definition to describe()
   * @param {object} feature given from .feature
   * @param {function} definitionFn given from .test.js
   * @param {array} args given by matching feature.name with definitionFn.regExp
   */
  function applyDefinition(feature, definition, args) {
    var items,
        i,
        l,
        background,
        errors = [],
        result,
        currentParent = getParent();

    setParent(definition);
    definition.fn.apply(definition.thisArg, args);

    if (definition.type === FEATURE) {
      definition.executed = true;
      setParent(currentParent);
      addDefinition(definition.type, definition.name, definition.fn, definition.thisArg);
      setParent(definition);
    }

    if (feature.hasOwnProperty('background')) {
      if (feature.background) {
        feature.background.file = feature.file;
      }
      background = feature.background;
    }
    if (feature.hasOwnProperty('scenarioDefinitions')) {
      items = feature.scenarioDefinitions;
      l = items.length;
      for (i = 0; i < l; i++) {
        items[i].file = feature.file;
        result = processDefinition(items[i], background);
        if (result) {
          if (result instanceof Error) {
            errors.push(result);
          } else {
            result.unshift(errors.length, 0);
            Array.prototype.splice.apply(errors, result);
          }
        }
      }
    } else if (feature.hasOwnProperty('steps')) {
      items = feature.steps;
      l = items.length;
      for (i = 0; i < l; i++) {
        items[i].file = feature.file;
        if (feature.example) {
          items[i].example = feature.example;
        }
        result = processStep(items[i]);
        if (result) {
          errors.push(result);
        }
      }
    }

    setParent(currentParent);
    if (errors.length > 0) {
      return errors;
    }
  }

  /**
   * applying (object)feature.name against the regexp (feature)definition.(regexp)name
   * in order to define the args and define the fn
   * @param {object} feature - a feature from parsing the .feature file
   * @param {object} definition - a definition given by using feature(regexp|string, function)
   * @return {function} definitionFn, {array}args
   */
  function match(feature, definition) {
    var result,
        args,
        feature_type = feature.type;
    if (feature_type === SCENARIOOUTLINE) {
      feature_type = SCENARIO;
    }

    if (feature_type !== definition.type) {
      return;
    }
    if (definition.type === FEATURE && definition.executed) {
      return;
    }

    if (definition.name === undefined && definition.type === BACKGROUND) {
      result = definition;
      args = [];
    } else if (definition.name.constructor === String) {
      if (definition.name === feature.name) {
        result = definition;
        args = [];
      }
    } else if (definition.name.constructor === RegExp) {
      args = feature.name.match(definition.name);
      if (args) {
        // the given regexp seems to fit the feature.name
        // seems that I need to study how to match strings to regexp
        if (args[0] === args.input) {
          // because here I do an strange comparison
          args = args.slice(1); // and then eliminate the first element
          result = definition;
        } else {
          result = undefined;
        }
      }
    } else {
      throw new Error('undefined type to identify the ' + feature.type + '"' + feature.name + '"' + ". This should be a regexp or an string object");
    }

    if (result) {
      return {
        definition: result,
        args: args
      };
    }
    return;
  }

  /**
   * TODO: Add documentation for this function
   */
  function processStep(step) {
    var parent = getParent(),
        definitions = parent.definitions,
        item,
        args,
        args_l,
        definitionFn,
        result,
        resolved,
        max,
        row = step.text,
        i,
        l,
        dataTable,
        e,
        parsedRow;

    /**
     * TODO: Add documentation for this function
     */
    function extendParams(done) {
      var i,
          l = definitionFn.length;
      if (dataTable) {
        l--;
      }
      if (done) {
        l--;
      }

      for (i = args.length; i < l; i++) {
        args.push(undefined);
      }

      if (dataTable) {
        args.push(dataTable);
      }
      if (done) {
        args.push(done);
      }
    }

    if (step.argument) {
      dataTable = [];
      l = step.argument.rows.length;
      for (i = 0; i < l; i++) {
        parsedRow = parseRow(step.argument.rows[i]);
        if (parsedRow instanceof Array && parsedRow.length === 1) {
          parsedRow = parsedRow[0];
        }
        dataTable.push(parsedRow);
      }
      if (dataTable.length == 1) {
        dataTable = dataTable[0];
        if (dataTable instanceof Array) {
          if (dataTable.length == 1) {
            dataTable = dataTable[0];
          }
        }
      }
    }
    if (step.example) {
      row = applyRow(row, step.example);
    }

    /**
     * TODO: Add documentation for this function
     */
    function enveloperAsync(done) {
      extendParams(done);
      definitionFn.apply(result.definition.thisArg, args);
    }

    /**
     * TODO: Add documentation for this function
     */
    function* coenveloperAsync(done) {
      extendParams(done);
      yield* definitionFn.apply(result.definition.thisArg, args);
    }

    /**
     * TODO: Add documentation for this function
     */
    function enveloper() {
      extendParams();
      definitionFn.apply(result.definition.thisArg, args);
    }

    /**
     * TODO: Add documentation for this function
     */
    function* coenveloper() {
      extendParams();
      yield* definitionFn.apply(result.definition.thisArg, args);
    }

    // Search process
    while (true) {
      result = undefined;
      resolved = {};
      max = 0;
      for (item in definitions) {
        step.name = row;
        result = match(step, definitions[item]);
        if (result) {
          resolved[result.args.length] = result;
          if (max < result.args.length) {
            max = result.args.length;
          }
        }
      }
      for (i = max; i >= 0; i--) {
        if (resolved.hasOwnProperty(i)) {
          result = resolved[i];
        } else {
          break;
        }
      }
      if (!parent || result) {
        break;
      }
      parent = parent.parent;
      if (!parent) {
        definitions = getDefinitions();
      } else {
        definitions = parent.definitions;
      }
    }

    if (result) {
      // if definitionFn found
      definitionFn = result.definition.fn;
      args = result.args;
      args_l = args.length;
      if (dataTable) {
        args_l++;
      }
      if (args_l < definitionFn.length) {
        if (isGeneratorFunction(definitionFn)) {
          bdd_functions.it(row, coenveloperAsync);
        } else {
          bdd_functions.it(row, enveloperAsync); // send to it the final version for definitionFn enveloped into an enveloper
        }
      } else {
          if (isGeneratorFunction(definitionFn)) {
            bdd_functions.it(row, coenveloper); // send to it the final version for definitionFn enveloped into an enveloper
          } else {
              bdd_functions.it(row, enveloper); // send to it the final version for definitionFn enveloped into an enveloper
            }
        }
      return;
    }
    // If no definition matchet at all
    else {
        // TODO> make the standard format for this warning
        // TODO> take in count the info given at definition.location
        e = new Error(step.keyword + 'not found "' + row + '"', step.file.path);
        if (throwErrors_flag) {
          throw e;
        } else {
          return e;
        }
      }
  }

  /**
   * TODO: Add documentation for this function
   */
  function processDefinition(definition, background) {
    var definitions,
        item,
        args,
        found,
        parent = getParent(),
        i,
        l,
        examples,
        headers,
        tableHeader,
        tableBody,
        definition_item,
        definition_replaced,
        background_replaced,
        definition_set = [definition],
        background_set,
        errors = [],
        result,
        e;

    if (parent) {
      definitions = parent.definitions;
    } else {
      definitions = getDefinitions();
    }

    if (definition.examples) {
      definition_set = [];
      examples = [];
      headers = [];

      tableHeader = definition.examples[0].tableHeader;
      tableBody = definition.examples[0].tableBody;

      l = tableHeader.cells.length;
      for (i = 0; i < l; i++) {
        headers.push(tableHeader.cells[i].value);
      }
      l = tableBody.length;
      for (i = 0; i < l; i++) {
        examples.push(parseRow(tableBody[i], headers));
      }
      for (i = 0; i < l; i++) {
        definition_replaced = JSON.parse(JSON.stringify(definition));
        definition_replaced.name = applyRow(definition.name, examples[i]);
        definition_replaced.example = examples[i];
        definition_set.push(definition_replaced);
      }
    }

    l = definition_set.length;
    for (i = 0; i < l; i++) {
      definition_item = definition_set[i];
      while (true) {
        for (item in definitions) {
          found = match(definition_item, definitions[item]);

          if (found) {
            break;
          }
        }
        if (!parent || found) {
          break;
        }
        definitions = getDefinitions();
        parent = undefined;
      }
      // if definition matched
      if (found) {
        if (background) {
          background_replaced = background;
          if (definition_item.example) {
            background_replaced = JSON.parse(JSON.stringify(background));
            background_replaced.name = applyRow(background.name, definition_item.example);
            background_replaced.example = definition_item.example;
          }
          result = processDefinition(background_replaced);
          if (result instanceof Error) {
            // TODO> make the standard format for this warning
            // TODO> take in count the info given at definition.location
            e = new Error(background_replaced.type + ' not found "' + background_replaced.name + '"', background_replaced.file.path);
            if (throwErrors_flag) {
              throw e;
            } else {
              return e;
            }
          }
          if (result) {
            result.unshift(errors.length, 0);
            Array.prototype.splice.apply(errors, result);
          }
        }
        bdd_functions.describe(definition_item.name, function () {
          result = applyDefinition(definition_item, found.definition, found.args);
          if (result) {
            result.unshift(errors.length, 0);
            Array.prototype.splice.apply(errors, result);
          }
        });
      }
      // If no definition matchet at all
      else {
          // TODO> make the standard format for this warning
          // TODO> take in count the info given at definition.location
          e = new Error(definition_item.type + ' not found "' + definition_item.name + '"', definition_item.file.path);
          if (throwErrors_flag) {
            throw e;
          } else {
            return e;
          }
        }
    }
    if (errors.length > 0) {
      return errors;
    }
  }

  /**
   * TODO: Add documentation for this function
   */
  function run() {
    var features = getFeatures(),
        l = features.length,
        i,
        errors = [],
        result;

    defaultSetupOnce();
    for (i = 0; i < l; i++) {
      result = processDefinition(features[i]);
      if (result) {
        if (result instanceof Error) {
          errors.push(result);
        } else {
          result.unshift(errors.length, 0);
          Array.prototype.splice.apply(errors, result);
        }
      }
    }
    reset();
    return errors;
  }

  /**
   * TODO: Add documentation for this function
   */
  function loadFeature(feature, file) {
    var _feature = feature || {};
    defaultSetupOnce();

    // Be careful with this comparision. I'm assuming that programm is running in nodeJS environment
    if (feature.constructor === String) {
      _feature = parserFn(feature);
    }

    _feature.file = file || {};
    addFeature(_feature);
  }

  /**
   * TODO: Add documentation for this function
   */
  function feature(name, fn, thisArg) {
    return addDefinition(FEATURE, name, fn, thisArg);
  }

  /**
   * TODO: Add documentation for this function
   */
  function background(nameOrFn, fnOrThisArg, thisArgOrUndefined) {
    var name, fn, thisArg;
    if (nameOrFn) {
      if (nameOrFn.constructor === String || nameOrFn.constructor === RegExp) {
        name = nameOrFn;
      } else if (nameOrFn.constructor === Function) {
        name = undefined;
        fn = nameOrFn;
      } else {
        throw new Error("Incorrect name definition for background"); // TODO: Think about this error and how to show it
      }
    } else {
        throw new Error("Something was wrong");
      }

    if (fnOrThisArg) {
      if (fnOrThisArg.constructor === Function) {
        if (name === undefined) {
          throw new Error("Incorrect fn definition> two functions?"); // TODO: see above
        }
        fn = fnOrThisArg;
      } else if (fnOrThisArg.constructor === Object) {
        if (name !== undefined) {
          throw new Error("Incorrect fn definition> where's the definition function?"); // TODO: see above
        }
        thisArg = fnOrThisArg;
      }
    }

    if (thisArgOrUndefined) {
      if (thisArgOrUndefined.constructor === Object) {
        if (fn.constructor === Object) {
          throw new Error("Incorrect fn definition> why two thisArgs?"); // TODO: see above
        }
        if (fn.constructor === Function && (name.constructor === String || name.constructor === RegExp)) {
          thisArg = thisArgOrUndefined;
        } else {
          throw new Error("Read the documentation...");
        }
      }
    }
    return addDefinition(BACKGROUND, name, fn, thisArg);
  }

  /**
   * TODO: Add documentation for this function
   */
  function scenario(name, fn, thisArg) {
    return addDefinition(SCENARIO, name, fn, thisArg);
  }

  /**
   * TODO: Add documentation for this function
   */
  function step(name, fn, thisArg) {
    return addDefinition(STEP, name, fn, thisArg);
  }

  /**
   * TODO: Add documentation for this function
   */
  function given(name, fn, thisArg) {
    return addDefinition(STEP, name, fn, thisArg);
  }

  /**
   * TODO: Add documentation for this function
   */
  function when(name, fn, thisArg) {
    return addDefinition(STEP, name, fn, thisArg);
  }

  /**
   * TODO: Add documentation for this function
   */
  function then(name, fn, thisArg) {
    return addDefinition(STEP, name, fn, thisArg);
  }

  /**
   * TODO: Add documentation for this function
   */
  function and(name, fn, thisArg) {
    return addDefinition(STEP, name, fn, thisArg);
  }

  /**
   * TODO: Add documentation for this function
   */
  function but(name, fn, thisArg) {
    return addDefinition(STEP, name, fn, thisArg);
  }
});
