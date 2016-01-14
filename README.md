[![Build Status](https://travis-ci.org/rianby64/apolog.svg?branch=master)](https://travis-ci.org/rianby64/apolog)
# Apolog

A Javascript testing adapter that fits with [Jasmine](https://github.com/jasmine/jasmine), [Mocha](https://github.com/mochajs/mocha) or any other BDD framework that uses ["describe"](http://jasmine.github.io/2.4/introduction.html) and ["it"](http://jasmine.github.io/2.4/introduction.html).
The main goal is to provide a simple interface that process any .feature file written in [Gherkin](https://github.com/cucumber/gherkin-javascript) and link it with the specs.


### Installation
npm install apolog --save-dev

### How to integrate?
If you plan to use [Apolog](https://github.com/rianby64/apolog) with [Jasmine](https://github.com/jasmine/jasmine-npm) then I suggest you to

1. [jasmine init](http://jasmine.github.io/2.4/node.html)

2. add [this](https://gist.github.com/rianby64/eaa4c899c2e41a143b7a#file-apolog-js) to the spec/helper directory

3. If you plan to use [generators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*) then don't forget to add [this](https://github.com/rianby64/apolog/blob/master/spec/helpers/jasmine-co.js) to the spec/helper directory

First helper gives you the freedom to write
```javascript
feature(/Some feature.../, function() {
  scenario(/Some scenario.../, function() {
    // ...
  });
});
```
Instead of
```javascript
var apolog = require('apolog');
apolog.feature(/Some feature.../, function() {
  apolog.scenario(/Some scenario.../, function() {
    // ...
  });
});
```
Check [documentation about the second helper](https://github.com/gradecam/jasmine-co) 

For [Mocha](https://github.com/mochajs/mocha) you should add similar code.

### A simple example
Lets consider the first example given at [cucumber.io](https://cucumber.io/docs/reference)
```
Feature: Refund item

  Scenario: Jeff returns a faulty microwave
    Given Jeff has bought a microwave for $100
    And he has a receipt
    When he returns the microwave
    Then Jeff should be refunded $100
```

Step by step:

* npm install apolog jasmine --save-dev
* create features directory and add [this file](https://gist.github.com/rianby64/bfb4f7391e6e34973745#file-simplestory-feature)
* ./node_modules/.bin/jasmine init
* follow the instructions above "How to integrate?"
* add [this file](https://gist.github.com/rianby64/d998669d07f5582a186e#file-simplestory-spec-js)
* add the script for testing at package.json
* run tests "npm test"

As you noticed in the .spec.js are defined every step given at .feature file. Also, .spec.js points to the .feature file by calling loadFeature(...); so after loading one or more features you've to run the story against the definitions by calling run().

Internally run() matches all the definitions with the loaded features and finally resets everything. By this reason, run() must be the last thing that should be called at any .spec.js file.

Also run() returns an array with possible errors, i.e. if run() === [] then no errors were found, and all definitions matched each line from .feature file. But, if run !== [] then some errors ocurred silently. So, check everytime if errors were found after running run()

