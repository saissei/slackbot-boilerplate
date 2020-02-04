import { VOUser } from "./VOUser";
import { VODateTime } from "./VODateTime";
import moment = require("moment-timezone");

export class VOUserSettings {
  private user: VOUser;
  private timestamp: VODateTime | null = null;
  private static DATETIMEFILTER = (user: VOUser, timestamp: VODateTime): VOUserSettings =>{
    return new VOUserSettings(user, timestamp);
  }
  public static of(user: VOUser, timestamp?: VODateTime): VOUserSettings {
    if(timestamp){
      return this.DATETIMEFILTER(user, timestamp);
    }
    return new VOUserSettings(user);
  }
  private constructor(user: VOUser, timestamp?: VODateTime){
    this.user = user;
    if(timestamp){
      this.timestamp = timestamp;
    }
  }
  public toJson(){
    const filterDate: () => string = (): string => {
      if(this.timestamp === null){
        return moment().tz('Asia/tokyo').toISOString()
      }
      return this.timestamp.toISODate();
    }
    const settings = {
      userId: this.user.toString(),
      filterDate: filterDate()
    }
    return settings;
  }
}
