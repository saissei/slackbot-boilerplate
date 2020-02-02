export interface TAGS {
  name: string;
  data: Array<string>;
}

export interface TAGQUERY {
  name: string;
}

export class VODBTags {
  private data: TAGS;
  public static of(tag: string): VODBTags {
    const tagData: TAGS = {
      name: tag,
      data: []
    };
    return new VODBTags(tagData);
  }
  private constructor(tagData: TAGS){
    this.data = tagData;
  }
  public toJson(): TAGS {
    return this.data;
  }
  public toQuery(): TAGQUERY {
    const query: TAGQUERY = {
      name: this.data.name
    };
    return query;
  }
}
