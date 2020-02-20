export interface SPACEID {
  space: string;
}
export interface SEARCHKEY {
  teamId: string;
}

export class VOSpaceId {
  private id: SPACEID;
  public static of(space: string): VOSpaceId {
    const id: SPACEID = {
      space: space
    };
    return new VOSpaceId(id);
  }
  private constructor(id: SPACEID) {
    this.id = id;
  }
  public toJson(): SPACEID {
    return this.id;
  }
  public toSearchKey(): SEARCHKEY {
    const teamId = {
      teamId: this.id.space
    };
    return teamId;
  }
}
