import { Type } from '../types/Type';
import config from 'config';

type SLACKCONFIG = {
  signingSecret: string;
  token: string;
}

export class VOConfig {
  private _conf: SLACKCONFIG;
  public static of(): VOConfig | undefined {
    let _conf: SLACKCONFIG;
    try {
      _conf = config.get('slack_config');
    } catch (err) {
      require('dotenv').config();
      if (!process.env.slack_config){
        return;
      }
      _conf = JSON.parse(process.env.slack_config);
    }
    if (Type.isPlainObject(_conf)){
      return new VOConfig(_conf);
    }
    return;
  }
  private constructor(config: SLACKCONFIG){
    this._conf = config;
  }
  public toString(): string {
    return JSON.stringify(this._conf);
  }
  public extractToken(): string {
    return this._conf.token;
  }
  public extractSigningSecret(): string {
    return this._conf.signingSecret;
  }
  public toJSON(): SLACKCONFIG {
    return this._conf;
  }
}
