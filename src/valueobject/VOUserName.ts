export class VOUserName {
  private userName: string;
  public static of(userName: string): VOUserName {

    return new VOUserName(userName);

  }
  private constructor(userName: string){
    this.userName = userName;
  }
  public toString(): string {
    return this.userName;
  }
}
