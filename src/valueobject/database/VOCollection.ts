import moment, { Moment } from 'moment-timezone';

export interface COLLECTED extends INDATA {
  timestamp: Moment;
  update: Moment;
}

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
export interface INDATA {
  space: string;
  userId: string;
  title: string;
  url: string;
  tag: Array<string>;
  description: string;
  detail: string;
  timestamp?: Moment;
  update?: Moment;
}

export class VOCollection {
  private data: INDATA;
  public static of(data: INDATA): VOCollection {
    return new VOCollection(data);
  }
  private constructor(data: INDATA){
    this.data = data;
  }
  public toCollectData(): COLLECTED {
    const nowDatetime: Moment = moment().tz('Asia/tokyo');

    if (this.data.timestamp === undefined){
      const collectData: COLLECTED = {
        space: this.data.space,
        userId: this.data.userId,
        title: this.data.title,
        url: this.data.url,
        tag: this.data.tag,
        description: this.data.description,
        detail: this.data.detail,
        timestamp: nowDatetime,
        update: nowDatetime
      };
      return collectData;
    }
    const collectData: COLLECTED = {
      space: this.data.space,
      userId: this.data.userId,
      title: this.data.title,
      url: this.data.url,
      tag: this.data.tag,
      description: this.data.description,
      detail: this.data.detail,
      timestamp: this.data.timestamp,
      update: nowDatetime
    };
    return collectData;
  }
}
