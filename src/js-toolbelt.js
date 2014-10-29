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

  function equalsObj(o1, o2) {
    for (var key in o1) {
      if (o1.hasOwnProperty(key) && !jst.equals(o1[key], o2[key])) {
        return false;
      }
    }
    return true;
  }

  jst.equals = function(o1, o2) {
    switch (typeof o1) {
      case "number":
      case "string":
            return o1 === o2;
      case "object":
            return typeof o2 === "object" && equalsObj(o1, o2);
      default:
            return false;
    }
  };

  jst.cat = function() {
    var head = _.first(arguments);
    if (jst.existy(head)) {
      return head.concat.apply(head, _.rest(arguments));
    } else {
      return [];
    }
  };

  jst.construct = function(head, tail) {
    return jst.cat([head], _.toArray(tail));
  };

  jst.existy = function(x) {
    return x != null;
  };

  jst.truthy = function(x) {
    return (x !== false) && jst.existy(x);
  };

  jst.partial1 = function (fun, arg1) {
    return function () {
      var args = jst.construct(arg1, arguments);
      return fun.apply(fun, args);
    };
  };

  jst.partial = function (fun) {
    var pargs = _.rest(arguments);
    return function () {
      var args = jst.cat(pargs, _.toArray(arguments));
      return fun.apply(fun, args);
    };
  };

  jst.deepClone = function (obj) {
    if (!jst.existy(obj) || !_.isObject(obj)) {
      return obj;
    }

    var copy = new obj.constructor();
    for (var key in obj)
      if (obj.hasOwnProperty(key))
        copy[key] = jst.deepClone(obj[key]);

    return copy;
  };

  jst.flat = function(array) {
    if (_.isArray(array)) {
      return jst.cat.apply(jst.cat, _.map(array, jst.flat));
    } else {
      return [array];
    }
  };

  jst.visit = function(mapFun, resultFun, array) {
    if (_.isArray(array)) {
      return resultFun(_.map(array, mapFun));
    } else {
      return resultFun(array);
    }
  };

  jst.postDepth = function (fun, ary) {
    return jst.visit(jst.partial1(jst.postDepth, fun), fun, ary);
  };

  jst.preDepth = function (fun, ary) {
    return jst.visit(jst.partial1(jst.preDepth, fun), fun, fun(ary));
  };

  jst.trampoline = function (fun) {
    var res = fun.apply(fun, _.rest(arguments));

    while (_.isFunction(res)) {
      res = res();
    }

    return res;
  };

  jst.generator = function(seed, current, step) {
    return {
      head: current(seed),
      tail: function() {
        return jst.generator(step(seed), current, step);
      }
    };
  };

  jst.genHead = function (gen) {
    return gen.head;
  };

  jst.genTail = function (gen) {
    return gen.tail();
  };

  jst.genGet = function(gen, pos) {
    var doGet = function(g, p) {
      if (p === 0) {
        return g;
      } else {
        return jst.partial(doGet, jst.genTail(g), p - 1);
      }
    };
    return jst.trampoline(doGet, gen, pos);
  };

  jst.genTake = function(gen, pos) {
    var doTake = function(g, p, ret) {
      if (p === 0)
        return ret;
      else
        return jst.partial(doTake, jst.genTail(g), p - 1, jst.cat(ret, jst.genHead(g)));
    };

    return jst.trampoline(doTake, gen, pos, []);
  };


})(jst, _);
