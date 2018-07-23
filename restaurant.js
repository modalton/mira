module.exports = exports = class Restraunt {
  constructor(name, opening_day, closing_day, opening_time, closing_time) {
    //Js formatter made this particually ugly. Just argument asserts so can skip over.
    if (!(typeof name === "string" || name instanceof String))
      throw new TypeError("Restaurant name must be string type");
    if (!Number.isInteger(opening_day))
      throw new TypeError("Restraunt opening day must be integer type");
    if (!Number.isInteger(closing_day))
      throw new TypeError("Restraunt closing day must be integer type");
    if (
      !(typeof opening_time === "object") ||
      !(
        opening_time.hasOwnProperty("hr") && opening_time.hasOwnProperty("min")
      ) ||
      (!Number.isInteger(opening_time.min) ||
        !Number.isInteger(opening_time.min))
    )
      throw new TypeError(
        "Restraunt opening_time must be object w/hr & min properties"
      );
    if (
      !(typeof closing_time === "object") ||
      !(
        closing_time.hasOwnProperty("hr") && closing_time.hasOwnProperty("min")
      ) ||
      (!Number.isInteger(closing_time.min) ||
        !Number.isInteger(closing_time.min))
    )
      throw new TypeError(
        "Restraunt closing_time must be object w/hr & min properties"
      );
    //End of argument asserts

    this.name = name;
    this.opening_day = opening_day;
    this.closing_day = closing_day;
    this.opening_time = opening_time;
    this.closing_time = closing_time;
  }

  isOpenAt(datetime) {
    if (!(datetime instanceof Date))
      throw new TypeError("isOpenAt requires datetime object");
    const day = datetime.getDay();
    const hour = datetime.getHours();
    const min = datetime.getMinutes();

    let day_flag = false;
    let time_flag = false;

    //If:normal date range (ex mon-fri). Else:wrap around (ex fri-mon)
    if (this.opening_day <= this.closing_day) {
      if (this.opening_day <= day && day <= this.closing_day) {
        day_flag = true;
      }
    } else {
      if (this.closing_day >= day || this.opening_day <= day) {
        day_flag = true;
      }
    }

    //If:normal hr range (ex. 4am-12pm) Else: wrap around (ex. 5pm - 12am)
    if (
      this.closing_time.hr > this.opening_time.hr ||
      (this.closing_time.hr === this.opening_time.hr &&
        this.closing_time.min >= this.opening_time.min)
    ) {
      if (
        this.opening_time.hr <= hour &&
        hour <= this.closing_time.hr &&
        (hour === this.closing_time.hr ? min <= this.closing_time.min : true) &&
        (hour === this.opening_time.hr ? min >= this.opening_time.min : true)
      ) {
        time_flag = true;
      }
    } else {
      if (
        this.opening_time.hr <= hour ||
        (hour <= this.closing_time.hr &&
          (hour === this.closing_time.hr
            ? min <= this.closing_time.min
            : true) &&
          (hour === this.opening_time.hr ? min >= this.opening_time.min : true))
      ) {
        time_flag = true;
      }
    }

    return day_flag && time_flag;
  }
};
