import config from 'config';
import Log4js from 'log4js';

export class VOLoggerConfig {
  private _conf: Log4js.Configuration;
  public static of(): VOLoggerConfig {
    let _conf: Log4js.Configuration;
    try{
      _conf = config.get('log4js');
    }catch(err){
      require('dotenv').config();
      _conf = JSON.parse(process.env.log4js);
    }
    return new VOLoggerConfig(_conf)
  }
  private constructor(_conf: Log4js.Configuration){
    this._conf = _conf
  }
  public toJSON(): Log4js.Configuration {
    return this._conf;
  }
}