const Restaurant = require("./restaurant.js");
const fs = require('fs');


function findOpenRestaurants(csv_filename, search_datetime) {
  const file = fs.readFileSync(csv_filename);

  function createHrMinDate(str,ampm){
    let clock_obj = {hr:0,min:0};
    if(str.indexOf(':')!=-1){
      const hr_and_min = str.split(':');
      const hrs = (ampm.trim() === "am") ? parseInt(hr_and_min[0]) : parseInt(hr_and_min[0])+12;
      clock_obj.hr = hrs;
      clock_obj.min = parseInt(hr_and_min[1]);
      
    }else{
      const hrs = (ampm.trim() === "am") ? parseInt(str) : parseInt(str)+12;
      clock_obj.hr = hrs;
    }
    
    return clock_obj;
  }

  function parseFile(file){
    const days_enum = {
      "Sun":0,
      "Mon":1,
      "Tue":2,
      "Wed":3,
      "Thu":4,
      "Fri":5,
      "Sat":6
    };

    let rest = file.toString().split("\r\n").filter(el=>el!=='').map(line => {
      const match = line.match(/"(.+)","(\w+)-(\w+) (\S+) (am |pm )- (\S+) (am|pm)"/);
      const name = match[1];
      const opening_day = days_enum[match[2]];
      const closing_day = days_enum[match[3]];
      const opening_time = createHrMinDate(match[4],match[5]);
      const closing_time = createHrMinDate(match[6],match[7]);
      return new Restaurant(name,opening_day,closing_day,opening_time,closing_time);
    });



    rest.filter(r=> r.isOpenAt(new Date(Date.now()))).map(el => el.stats())
  }
  

  parseFile(file);
}

findOpenRestaurants("restaurants.txt");



