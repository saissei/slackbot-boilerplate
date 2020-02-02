import { TAGS } from "./database/VODBTags";

interface TAGSOBJECT {
  type: string;
  text: string;
  emoji: boolean;
}

export interface OPTIONTAGS {
  text: TAGSOBJECT;
  value: string;
}

export class VOOptionTags {
  private tags: Array<OPTIONTAGS>;
  public static of(dbTags: Array<TAGS>): VOOptionTags {
    const tags: Array<OPTIONTAGS> = dbTags.map((item: TAGS) => ({
      text: {
        type: 'plain_text',
        text: item.name,
        emoji: true
      },
      value: item.name
    }))
    return new VOOptionTags(tags);
  }
  private constructor(tags: Array<OPTIONTAGS>){
    this.tags = tags;
  }
  public toJson(): Array<OPTIONTAGS> {
    return this.tags;
  }
}
