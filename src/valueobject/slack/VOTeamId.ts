

export class VOTeamId {
  private teamId: string;
  public static of(teamId: string): VOTeamId {
    return new VOTeamId(teamId);
  }
  private constructor(teamId: string){
    this.teamId = teamId;
  }
  public toString(): string {
    return this.teamId;
  }
}
