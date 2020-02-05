export interface CONTENTID {
  _id: string;
}

export class VOContentId {
  private id: string;
  public static of(contentId: string): VOContentId {
    return new VOContentId(contentId);
  }
  private constructor(contentId: string){
    this.id = contentId;
  }
  public toKeyValue(): CONTENTID {
    return {
      _id: this.id
    };
  }
}
