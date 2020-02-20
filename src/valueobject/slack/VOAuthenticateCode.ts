export class VOAuthenticateCode {
  private code: string;
  public static of(code: string): VOAuthenticateCode {
    return new VOAuthenticateCode(code);
  }
  private constructor(code: string){
    this.code = code;
  }
  public toString(): string {
    return this.code;
  }
}
