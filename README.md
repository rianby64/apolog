[![Build Status](https://travis-ci.org/rianby64/apolog.svg?branch=master)](https://travis-ci.org/rianby64/apolog)
# Apolog

A Javascript testing adapter that fits with [Jasmine](https://github.com/jasmine/jasmine), [Mocha](https://github.com/mochajs/mocha) or any other BDD framework that uses ["describe"](http://jasmine.github.io/2.4/introduction.html) and ["it"](http://jasmine.github.io/2.4/introduction.html).
The main goal is to provide a simple interface that process any .feature file written in [Gherkin](https://github.com/cucumber/gherkin-javascript) and link it with the specs.


### Installation
npm install apolog --save-dev

### How to integrate?
If you plan to use [Apolog](https://github.com/rianby64/apolog) with [Jasmine](https://github.com/jasmine/jasmine-npm) then I suggest you to

1. [jasmine init](http://jasmine.github.io/2.4/node.html)

2. add [this](https://github.com/rianby64/apolog/blob/master/spec/helpers/apolog.js) to the spec/helper directory

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
