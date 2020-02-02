import { PlainObject } from '../types/PlainObject';
import { Type } from '../types/Type';

export class VOActions {
  private actions: Array<PlainObject>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static of(actions: Array<any>): VOActions | undefined {
    if (Type.isArray(actions)){
      return new VOActions(actions);
    }
    return;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private constructor(actions: Array<any>){
    this.actions = actions;
  }
  public checkArraylength(): number {
    return this.actions.length;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public extractObject(): any {
    return this.actions[0];
  }
}
