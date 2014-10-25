(function () {
  "use strict";

  describe("chain", function () {
    it("should call functions in succession", function () {
      var plusOne = function (x) { return x + '1' };
      var plusTwo = function (x) { return x + '2' };
      var res = jst.chain([plusOne, plusTwo], ['0']);
      expect(res).toBe('012');
    });

  });

})();
