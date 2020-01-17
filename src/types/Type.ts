import * as check from 'check-types';
import moment from 'moment-timezone';
import { PlainObject } from './PlainObject';

export class Type {

  public static isString(value: unknown): value is string {
    if (check.string(value)) {
      return true;
    }

    return false;
  }

  public static isNumber(value: unknown): value is number {
    if (check.number(value)) {
      return true;
    }

    return false;
  }

  public static isInteger(value: unknown): value is number {
    if (check.integer(value)) {
      return true;
    }

    return false;
  }

  public static isBoolean(value: unknown): value is boolean {
    if (check.boolean(value)) {
      return true;
    }

    return false;
  }

  public static isPrimitive(value: unknown): boolean {
    if (check.primitive(value)) {
      return true;
    }

    return false;
  }

  public static isPlainObject(value: unknown): value is PlainObject {
    if (check.object(value)) {
      return true;
    }

    return false;
  }

  // FIXME Array<any> -> Array<unknown>
  public static isArray(value: unknown): value is Array<unknown> {
    if (check.array(value)) {
      return true;
    }

    return false;
  }

  public static isDateString(value: unknown): value is string {
    if (!Type.isString(value)) {
      return false;
    }
    if (moment(value).isValid()) {
      return true;
    }

    return false;
  }
}
