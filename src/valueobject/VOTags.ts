import moment from 'moment-timezone';

export interface COLLECTED extends COLLECTIONDATA {
  timestamp: string;
  update: string;
}

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
export interface COLLECTIONDATA {
  space: string;
  tag: string;
  timestamp?: string;
  update?: string;
}

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
export interface INPUTTAG extends COLLECTIONDATA {
  timestamp: string;
  update: string;
}

export class VOTags {
  private memo: Array<INPUTTAG>;
  public static of(view: any): VOTags {
    const now: string = moment().toISOString();
    const tagArray = (view.state.values.tags.data.value).split(',');
    const memo: Array<INPUTTAG> = tagArray.map((item: string): INPUTTAG => ({
      'space': view.team_id,
      'tag': item.trim(),
      'timestamp': now,
      'update': now
    }));
    return new VOTags(memo);
  }
  private constructor(memo: Array<INPUTTAG>){
    this.memo = memo;
  }
  public toJsonArray(): Array<INPUTTAG> {
    return this.memo;
  }
}
