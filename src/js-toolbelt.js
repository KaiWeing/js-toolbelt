/**
 * Javascript utilities
 *
 * @property jst
 * @type object
 */

/*global _*/

var jst = {};

(function (jst, _) {
  "use strict";

  jst.chain = function(fns) {
    var params = arguments[1];
    return _.reduce(fns, function(res, fn) {
      return fn(res);
    }, params);
  };

})(jst, _);
