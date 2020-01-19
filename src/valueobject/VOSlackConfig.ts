import { Type } from '../types/Type';
import config from 'config';

type SLACKCONFIG = {
  signingSecret: string;
  token: string;
}

export class VOConfig {
  private _conf: SLACKCONFIG;
  public static of(): VOConfig {
    let _conf: SLACKCONFIG;
    _conf = config.get('slack_config');
    if(_conf === undefined){
      require('dotenv').config();
      _conf = JSON.parse(process.env.SlackConfig);
    }
    if(Type.isPlainObject(_conf)){
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