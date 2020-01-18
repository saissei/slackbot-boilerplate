import { Type } from '../types/Type';

type SLACKCONFIG = {
  signingSecret: string;
  token: string;
}

export class VOConfig {
  private config: SLACKCONFIG;
  public static of(token: SLACKCONFIG): VOConfig {
    if(Type.isPlainObject(token)){
      return new VOConfig(token);
    }
    return;
  }
  private constructor(config: SLACKCONFIG){
    this.config = config;
  }
  public toString(): string {
    return JSON.stringify(this.config);
  }
  public extractToken(): string {
    return this.config.token;
  }
  public extractSigningSecret(): string {
    return this.config.signingSecret;
  }
  public toJSON(): SLACKCONFIG {
    return this.config;
  }
}