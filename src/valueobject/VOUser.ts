import { Type } from '../types/Type';

export class VOUser {
  private user: string;
  public static of(user: string): VOUser {
    if(!Type.isString(user)){
      return;
    }
    return new VOUser(user);
  }
  private constructor(user: string){
    this.user = user;
  }
  public toString(): string {
    return this.user;
  }
}