import moment, { Moment } from 'moment-timezone';
import { VOMemo } from '../VOMemo';

export interface COLLECTED extends COLLECTIONDATA {
  timestamp: Moment;
  update: Moment;
}

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
export interface COLLECTIONDATA {
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
  private data: COLLECTIONDATA;
  public static of(data: VOMemo): VOCollection {
    return new VOCollection(data.toJson());
  }
  private constructor(data: COLLECTIONDATA){
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
