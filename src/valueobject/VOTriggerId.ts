import { Type } from '../types/Type';

export class VOTriggerId {
  private triggerId: string;
  public static of(triggerId: string): VOTriggerId | undefined {
    if (Type.isString(triggerId)){
      return new VOTriggerId(triggerId);
    }
    return;
  }
  private constructor(triggerId: string){
    this.triggerId = triggerId;
  }
  public toString(): string {
    return this.triggerId;
  }
}
