//  Underscore.inflection.js
//  (c) 2014 Jeremy Ruppel
//  Underscore.inflection is freely distributable under the MIT license.
//  Portions of Underscore.inflection are inspired or borrowed from ActiveSupport
//  Version 1.0.0

var plurals      = [];
var singulars    = [];
var uncountables = [];

/**
 * Inflector
 */

module.exports = function(_){
  return inflection = {
    /**
     * `gsub` is a method that is just slightly different than our
     * standard `String#replace`. The main differences are that it
     * matches globally every time, and if no substitution is made
     * it returns `null`. It accepts a string for `word` and
     * `replacement`, and `rule` can be either a string or a regex.
     */
    gsub: function(word, rule, replacement) {
      var pattern = new RegExp(rule.source || rule, 'gi');

      return pattern.test(word) ? word.replace(pattern, replacement) : null;
    },

    /**
     * `plural` creates a new pluralization rule for the inflector.
     * `rule` can be either a string or a regex.
     */
    plural: function(rule, replacement) {
      plurals.unshift([rule, replacement]);
    },

    /**
     * Pluralizes the string passed to it. It also can accept a
     * number as the second parameter. If a number is provided,
     * it will pluralize the word to match the number. Optionally,
     * you can pass `true` as a third parameter. If found, this
     * will include the count with the output.
     */
    pluralize: function(word, count, includeNumber) {
      var result;

      if (count !== undefined) {
        count = parseFloat(count);
        result = (count === 1) ? inflection.singularize(word) : inflection.pluralize(word);
        result = (includeNumber) ? [count, result].join(' ') : result;
      } else {
        if (_(uncountables).includes(word)) {
          return word;
        }

        result = word;

        _(plurals).find(function(rule) {
          var gsub = inflection.gsub(word, rule[0], rule[1]);

          return gsub ? (result = gsub) : false;
        },
        this);
      }

      return result;
    },

    /**
     * `singular` creates a new singularization rule for the
     * inflector. `rule` can be either a string or a regex.
     */
    singular: function(rule, replacement) {
      singulars.unshift([rule, replacement]);
    },

    /**
     * `singularize` returns the singular version of the plural
     * passed to it.
     */
    singularize: function(word) {
      if (_(uncountables).includes(word)) {
        return word;
      }

      var result = word;

      _(singulars).find(function(rule) {
        var gsub = inflection.gsub(word, rule[0], rule[1]);

        return gsub ? (result = gsub) : false;
      },
      this);

      return result;
    },

    /**
     * `irregular` is a shortcut method to create both a
     * pluralization and singularization rule for the word at
     * the same time. You must supply both the singular form
     * and the plural form as explicit strings.
     */
    irregular: function(singular, plural) {
      inflection.plural('\\b' + singular + '\\b', plural);
      inflection.singular('\\b' + plural + '\\b', singular);
    },

    /**
     * `uncountable` creates a new uncountable rule for `word`.
     * Uncountable words do not get pluralized or singularized.
     */
    uncountable: function(word) {
      uncountables.unshift(word);
    },

    /**
     * `ordinalize` adds an ordinal suffix to `number`.
     */
    ordinalize: function(number) {
      if (isNaN(number)) {
        return number;
      }

      number = number.toString();
      var lastDigit = number.slice(-1);
      var lastTwoDigits = number.slice(-2);

      if (lastTwoDigits === '11' || lastTwoDigits === '12' || lastTwoDigits === '13') {
        return number + 'th';
      }

      switch (lastDigit) {
        case '1':
          return number + 'st';
        case '2':
          return number + 'nd';
        case '3':
          return number + 'rd';
        default:
          return number + 'th';
      }
    },

    /**
     * `titleize` capitalizes the first letter of each word in
     * the string `words`. It preserves the existing whitespace.
     */
    titleize: function(words) {
      if (typeof words !== 'string') {
        return words;
      }

      return words.replace(/\S+/g, function(word) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      });
    },

    /**
     * Resets the inflector's rules to their initial state,
     * clearing out any custom rules that have been added.
     */
    resetInflections: function() {
      plurals      = [];
      singulars    = [];
      uncountables = [];

      inflection.plural(/$/,                         's');
      inflection.plural(/s$/,                        's');
      inflection.plural(/(ax|test)is$/,              '$1es');
      inflection.plural(/(octop|vir)us$/,            '$1i');
      inflection.plural(/(octop|vir)i$/,             '$1i');
      inflection.plural(/(alias|status)$/,           '$1es');
      inflection.plural(/(bu)s$/,                    '$1ses');
      inflection.plural(/(buffal|tomat)o$/,          '$1oes');
      inflection.plural(/([ti])um$/,                 '$1a');
      inflection.plural(/([ti])a$/,                  '$1a');
      inflection.plural(/sis$/,                      'ses');
      inflection.plural(/(?:([^f])fe|([lr])?f)$/,     '$1$2ves');
      inflection.plural(/(hive)$/,                   '$1s');
      inflection.plural(/([^aeiouy]|qu)y$/,          '$1ies');
      inflection.plural(/(x|ch|ss|sh)$/,             '$1es');
      inflection.plural(/(matr|vert|ind)(?:ix|ex)$/, '$1ices');
      inflection.plural(/([m|l])ouse$/,              '$1ice');
      inflection.plural(/([m|l])ice$/,               '$1ice');
      inflection.plural(/^(ox)$/,                    '$1en');
      inflection.plural(/^(oxen)$/,                  '$1');
      inflection.plural(/(quiz)$/,                   '$1zes');

      inflection.singular(/s$/,                                                            '');
      inflection.singular(/(n)ews$/,                                                       '$1ews');
      inflection.singular(/([ti])a$/,                                                      '$1um');
      inflection.singular(/((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)ses$/, '$1$2sis');
      inflection.singular(/(^analy)ses$/,                                                  '$1sis');
      inflection.singular(/([^f])ves$/,                                                    '$1fe');
      inflection.singular(/(hive)s$/,                                                      '$1');
      inflection.singular(/(tive)s$/,                                                      '$1');
      inflection.singular(/([lr])ves$/,                                                    '$1f');
      inflection.singular(/([^aeiouy]|qu)ies$/,                                            '$1y');
      inflection.singular(/(s)eries$/,                                                     '$1eries');
      inflection.singular(/(m)ovies$/,                                                     '$1ovie');
      inflection.singular(/(ss)$/,                                                         '$1');
      inflection.singular(/(x|ch|ss|sh)es$/,                                               '$1');
      inflection.singular(/([m|l])ice$/,                                                   '$1ouse');
      inflection.singular(/(bus)es$/,                                                      '$1');
      inflection.singular(/(o)es$/,                                                        '$1');
      inflection.singular(/(shoe)s$/,                                                      '$1');
      inflection.singular(/(cris|ax|test)es$/,                                             '$1is');
      inflection.singular(/(octop|vir)i$/,                                                 '$1us');
      inflection.singular(/(alias|status)es$/,                                             '$1');
      inflection.singular(/^(ox)en/,                                                       '$1');
      inflection.singular(/(vert|ind)ices$/,                                               '$1ex');
      inflection.singular(/(matr)ices$/,                                                   '$1ix');
      inflection.singular(/(quiz)zes$/,                                                    '$1');
      inflection.singular(/(database)s$/,                                                  '$1');

      inflection.irregular('person', 'people');
      inflection.irregular('man',    'men');
      inflection.irregular('child',  'children');
      inflection.irregular('sex',    'sexes');
      inflection.irregular('move',   'moves');
      inflection.irregular('cow',    'kine');

      inflection.uncountable('equipment');
      inflection.uncountable('information');
      inflection.uncountable('rice');
      inflection.uncountable('money');
      inflection.uncountable('species');
      inflection.uncountable('series');
      inflection.uncountable('fish');
      inflection.uncountable('sheep');
      inflection.uncountable('jeans');

      return this;
    }
  }
}
