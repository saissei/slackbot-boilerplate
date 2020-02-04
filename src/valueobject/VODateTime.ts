import moment from 'moment-timezone';

interface SEARCHKEYVALUE {
  '$gte': string;
  '$lte': string;
}

export interface UPDATEKEYVALUE {
  update: SEARCHKEYVALUE;
}

export class VODateTime {
  private timestamp: string;
  public static of(timestamp: string): VODateTime {
    return new VODateTime(timestamp);
  }
  private constructor(timestamp: string){
    this.timestamp = timestamp;
  }
  public extractYearDate(): string {
    const formatting = moment(this.timestamp).format('YYYY-MM-DD');
    return formatting;
  }
  public toUpdateKeyValue(): UPDATEKEYVALUE {
    const start: string = moment(this.timestamp).toISOString();
    const end: string= moment(this.timestamp).add(1, 'days').toISOString();
    const kv: UPDATEKEYVALUE = {
      update: {
        '$gte': start,
        '$lte': end
      }
    };
    return kv;
  }
  public toISODate(): string {
    const iso: string = moment(this.timestamp).tz('Asia/tokyo').toISOString();
    return iso;
  }
}
