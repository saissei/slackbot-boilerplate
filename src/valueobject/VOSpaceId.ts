export interface SPACEID {
  spaceId: string
}

export class VOSpaceId {
  private id: SPACEID;
  public static of(space: string): VOSpaceId {
    const id: SPACEID = {
      spaceId: space
    }
    return new VOSpaceId(id);
  }
  private constructor(id: SPACEID) {
    this.id = id;
  }
  public toJson(): SPACEID {
    return this.id;
  }
}
