global.expect = require('chai').expect;

var _ = require("lodash")

global.inflection = require('..')(_);

/**
 * Reset inflections before each test
 */
beforeEach(function() {
  inflection.resetInflections();
});
