const assert = require("assert");
const Restaurant = require("./restaurant.js");
const findOpenRestaurants = require("./index.js");

describe("Restraunt", function() {
  //Some correct constructor arguments
  let name = "Big Bobs";
  let opening_day = 1;
  let closing_day = 5;
  let opening_time = { hr: 8, min: 30 };
  let closing_time = { hr: 20, min: 0 };

  describe("Constructor", function() {
    it("should throw without properly formatted name argument", function() {
      const test_arr = [null, undefined, {}, [], 1];
      for (let i of test_arr) {
        assert.throws(
          () =>
            new Restaurant(
              i,
              opening_day,
              closing_day,
              opening_time,
              closing_time
            ),
          TypeError
        );
      }
    });

    it("should throw without properly formatted opening/closing_day arguments", function() {
      const test_arr = [null, undefined, {}, [], "1"];
      for (let i of test_arr) {
        assert.throws(
          () =>
            new Restaurant(name, i, closing_day, opening_time, closing_time),
          TypeError
        );
        assert.throws(
          () =>
            new Restaurant(name, opening_day, i, opening_time, closing_time),
          TypeError
        );
      }
    });

    it("should throw without properly formatted opening/closing_time argument", function() {
      const test_arr = [null, undefined, {}, [], 1, "1", { hr: 1 }, { min: 2 }];
      for (let i of test_arr) {
        assert.throws(
          () => new Restaurant(name, opening_day, closing_day, i, closing_time),
          TypeError
        );
        assert.throws(
          () => new Restaurant(name, opening_day, closing_day, opening_time, i),
          TypeError
        );
      }
    });
  });

  describe("isOpenAt", function() {
    it("should throw without proper datetime argument", function() {
      const test_arr = [null, undefined, {}, [], 1, "1", { hr: 1 }, { min: 2 }];
      const rest = new Restaurant(
        name,
        opening_day,
        closing_day,
        opening_time,
        closing_time
      );
      for (let i of test_arr) {
        assert.throws(() => rest.isOpenAt(i), TypeError);
      }
    });

    it("should return true for times in, or equal to, range", function() {
      let date = new Date("Wed Jul 18 2018 10:00:00 GMT-0700 (PDT)");
      let edge_date_early = new Date("Mon Jul 23 2018 08:30:00 GMT-0700 (PDT)");
      let edge_date_late = new Date("Fri Jul 27 2018 20:00:00 GMT-0700 (PDT)");
      const rest = new Restaurant(
        name,
        opening_day,
        closing_day,
        opening_time,
        closing_time
      );

      assert.strictEqual(true, rest.isOpenAt(date));
      assert.strictEqual(true, rest.isOpenAt(edge_date_early));
      assert.strictEqual(true, rest.isOpenAt(edge_date_late));
    });

    it("should return false for correct dates but wrong hours", function() {
      let date_early = new Date("Mon Jul 23 2018 07:30:00 GMT-0700 (PDT)");
      let date_late = new Date("Fri Jul 27 2018 21:00:00 GMT-0700 (PDT)");
      const rest = new Restaurant(
        name,
        opening_day,
        closing_day,
        opening_time,
        closing_time
      );

      assert.strictEqual(false, rest.isOpenAt(date_early));
      assert.strictEqual(false, rest.isOpenAt(date_late));
    });

    it("should return false for incorrect dates but correct hours", function() {
      let date_early = new Date("Sun Jul 22 2018 10:17:27 GMT-0700 (PDT)");
      let date_late = new Date("Sat Jul 21 2018 10:17:27 GMT-0700 (PDT)");
      const rest = new Restaurant(
        name,
        opening_day,
        closing_day,
        opening_time,
        closing_time
      );

      assert.strictEqual(false, rest.isOpenAt(date_early));
      assert.strictEqual(false, rest.isOpenAt(date_late));
    });

    it("should support wrap-around date ranges (ex. tues-sun, fri-tues)", function() {
      //Open fri-tues
      const rest = new Restaurant(name, 5, 2, opening_time, closing_time);

      let date_valid = new Date("Mon Jul 23 2018 08:30:00 GMT-0700 (PDT)");
      let date_invalid = new Date("Wed Jul 25 2018 12:00:00 GMT-0700 (PDT)");

      assert.strictEqual(true, rest.isOpenAt(date_valid));
      assert.strictEqual(false, rest.isOpenAt(date_invalid));
    });
  });
});

describe("findOpenRestruants", function() {
  it("should throw without valid file argument", function() {
    const test_arr = [null, undefined, {}, [], "1"];
    for (let i of test_arr) {
      assert.throws(() => findOpenRestaurants(i, new Date(Date.now())));
    }
  });

  it("should throw without valid datetime argument", function() {
    const test_arr = [null, undefined, {}, [], "1"];
    for (let i of test_arr) {
      assert.throws(() => findOpenRestaurants("restaurants.txt", i), TypeError);
    }
    assert.throws(() => findOpenRestaurants("restaurants.txt"), TypeError);
  });

  it("should return complete subset of 'open' restraunts at specified date time", function() {
    const solution = ["All Season Restaurant", "Herbivore"];
    const wed_morn_date = new Date("Wed Jul 04 2018 10:00:00 GMT-0700 (PDT)");
    assert.deepEqual(
      solution,
      findOpenRestaurants("restaurants.txt", wed_morn_date)
    );
  });
});
