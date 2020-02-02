import config from 'config';
import Log4js from 'log4js';

export class VOLoggerConfig {
  private _conf: Log4js.Configuration;
  public static of(): VOLoggerConfig | undefined {
    try {
      const _conf: Log4js.Configuration = config.get('log4js');
      return new VOLoggerConfig(_conf);
    } catch (err){
      require('dotenv').config();
      if ( process.env.log4js !== undefined){
        const _conf = JSON.parse(process.env.log4js);
        return new VOLoggerConfig(_conf);
      }
    }
    return;
  }
  private constructor(_conf: Log4js.Configuration){
    this._conf = _conf;
  }
  public toJSON(): Log4js.Configuration {
    return this._conf;
  }
}
