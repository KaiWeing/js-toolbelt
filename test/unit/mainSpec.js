(function () {
  "use strict";

  describe("chain", function () {
    it("should call functions in succession", function () {
      var plusOne = function (x) {
        return x + '1'
      };
      var plusTwo = function (x) {
        return x + '2'
      };
      var res = jst.chain([plusOne, plusTwo], ['0']);
      expect(res).toBe('012');
    });
  });

  describe("equals", function () {
    it("should recognize equals primitives", function () {
      expect(jst.equals(1, 1)).toBe(true);
      expect(jst.equals("hello", "hello")).toBe(true);
    });
    it("should recognize strings", function () {
      expect(jst.equals("", "")).toBe(true);
      expect(jst.equals("a", "a")).toBe(true);
      expect(jst.equals("ab", "a")).toBe(false);
    });
    it("should recognize arrays", function () {
      expect(jst.equals([], 2)).toBe(false);
      expect(jst.equals([], [])).toBe(true);
      expect(jst.equals([1], [1])).toBe(true);
      expect(jst.equals([1], ['1'])).toBe(false);
    });
    it("should work with objects", function () {
      expect(jst.equals({}, {})).toBe(true);
      expect(jst.equals([{}], [{}])).toBe(true);
      expect(jst.equals([[1, 2]], [1, 2])).toBe(false);
      expect(jst.equals([[1, [2]]], [[1, [2]]])).toBe(true);
    });
    it("should work with falsies", function () {
      expect(jst.equals(false, undefined)).toBe(false);
      expect(jst.equals(null, undefined)).toBe(false);
      expect(jst.equals(1, NaN)).toBe(false);
    });
  });

  describe("deepClone", function () {
    it("should clone deeply", function () {
      var x = [{a: [1, 2, 3], b: 42}, {c: {d: []}}];
      var y = jst.deepClone(x);
      expect(x).toEqual(y);
      y[1]['c']['d'] = 32;
      expect(x).not.toEqual(y);
    });
  });

  describe("cat", function () {
    it("should concatenate arguments", function () {
      expect(jst.cat([1, 2, 3], [4, 5], [6, 7, 8])).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    });
  });

  describe("flat", function () {
    it("should flatten array", function () {
      expect(jst.flat([[1, 2], [3, 4]])).toEqual([1, 2, 3, 4]);
    });
  });

  describe("construct", function () {
    it("should place element at front of array", function () {
      expect(jst.construct("a", ["b", "c"])).toEqual(["a", "b", "c"]);
    });
  });

  describe("visit", function () {
    it("should visit", function () {
      var res = jst.visit(_.identity, _.isNumber, 42);
      expect(res).toBe(true);
    });
  });

  describe("generator", function () {
    var ints;

    beforeEach(function () {
      ints = jst.generator(1, _.identity, function (x) {
        return x + 1;
      });
    });

    it("should generate first tail", function () {
      expect(jst.genHead(ints)).toBe(1);
      expect(jst.genTail(ints).head).toBe(2);
    });

    it("should generate nth tail", function () {
      expect(jst.genGet(ints, 10).head).toBe(11);
    });

    it("should generate n elems", function () {
      expect(jst.genTake(ints, 4)).toEqual([1, 2, 3, 4]);
    });
  });

})();
