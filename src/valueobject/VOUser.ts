
export class VOUser {
  private user: string;
  public static of(user: string): VOUser {

    return new VOUser(user);
  }
  private constructor(user: string){
    this.user = user;
  }
  public toString(): string {
    return this.user;
  }
}
