const Restaurant = require("./restaurant.js");
const fs = require("fs");

function findOpenRestaurants(csv_filename, search_datetime) {
  if (!(search_datetime instanceof Date))
    throw new TypeError("search_datetime must be Date object");
  if (!(typeof csv_filename === "string" || csv_filename instanceof String))
    throw new TypeError("csc_filename must be string type");

  //Parsing helper function to make basic time object
  function createHrMin(str, ampm) {
    let clock_obj = { hr: 0, min: 0 };
    if (str.indexOf(":") != -1) {
      const hr_and_min = str.split(":");
      const hrs =
        ampm.trim() === "am"
          ? parseInt(hr_and_min[0]) % 12
          : parseInt(hr_and_min[0]) % 12 + 12;
      clock_obj.hr = hrs;
      clock_obj.min = parseInt(hr_and_min[1]);
    } else {
      const hrs =
        ampm.trim() === "am" ? parseInt(str) % 12 : parseInt(str) % 12 + 12;
      clock_obj.hr = hrs;
    }

    return clock_obj;
  }

  //Format specific parsing line by line (As per spec assume correct format).
  //Returns array of restraunt objects
  function parseFile(file) {
    const days_enum = {
      Sun: 0,
      Mon: 1,
      Tue: 2,
      Wed: 3,
      Thu: 4,
      Fri: 5,
      Sat: 6
    };

    return file
      .split(/\r?\n/g)
      .filter(el => el !== "")
      .map(line => {
        const match = line.match(
          /"(.+)","(\w+)-(\w+) (\S+) (am |pm )- (\S+) (am|pm)"/
        );
        const name = match[1];
        const opening_day = days_enum[match[2]];
        const closing_day = days_enum[match[3]];
        const opening_time = createHrMin(match[4], match[5]);
        const closing_time = createHrMin(match[6], match[7]);
        return new Restaurant(
          name,
          opening_day,
          closing_day,
          opening_time,
          closing_time
        );
      });
  }

  const file = fs.readFileSync(csv_filename).toString();
  const all_restaurants = parseFile(file);
  return all_restaurants
    .filter(rest => rest.isOpenAt(search_datetime))
    .map(rest => rest.name);
}

module.exports = exports = findOpenRestaurants;
