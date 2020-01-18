import { PlainObject } from "../types/PlainObject";
import { Type } from "types/Type";

export class VOActions {
  private actions: Array<PlainObject>;
  public static of(actions: Array<any>): VOActions {
    if(Type.isArray(actions)){
      return new VOActions(actions);
    }
    return;
  }
  private constructor(actions: Array<any>){
    this.actions = actions;
  }
  public checkArraylength(): number {
    return this.actions.length;
  }
  public extractObject(): any {
    return this.actions[0];
  }
}