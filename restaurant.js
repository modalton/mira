
module.exports = exports =  class Restraunt{
  constructor(name,opening_day,closing_day,opening_time,closing_time){
    this.name = name;
    this.opening_day = opening_day;
    this.closing_day = closing_day;
    this.opening_time = opening_time;
    this.closing_time = closing_time;
  }

  isOpenAt(datetime){
    const day = datetime.getDay();
    const hour = datetime.getHours();
    if(this.opening_day <= day && day <= this.closing_day && this.opening_time.hr <= hour && hour <= this.closing_time.hr){
      return true;
    }
    return false;
  }

  stats(){
    console.log(this.name,this.opening_day,this.closing_day,this.opening_time.hr,this.closing_time.hr);
  }
}
