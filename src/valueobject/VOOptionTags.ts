import { COLLECTEDDBTAGS } from '../repository/query/QueryTags';


interface TAGSOBJECT {
  type: string;
  text: string;
}

export interface OPTIONTAGS {
  text: TAGSOBJECT;
  value: string;
}

export class VOOptionTags {
  private tags: Array<OPTIONTAGS>;
  public static of(dbTags: Array<COLLECTEDDBTAGS>): VOOptionTags {
    const tags: Array<OPTIONTAGS> = dbTags.map((item: COLLECTEDDBTAGS) => ({
      text: {
        type: 'plain_text',
        text: item.tag
      },
      value: item.tag
    }));
    return new VOOptionTags(tags);
  }
  private constructor(tags: Array<OPTIONTAGS>){
    this.tags = tags;
  }
  public toJson(): Array<OPTIONTAGS> {
    return this.tags;
  }
}
