import Log4js from 'log4js';
import { VOLoggerConfig } from '../valueobject/VOLoggerConfig';


class Logger {
  private log4js: Log4js.Log4js;

  public constructor() {
    const _conf: Log4js.Configuration = VOLoggerConfig.of().toJSON();
    this.log4js = Log4js.configure(_conf);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public connectLogger(_level: string | undefined): any {
    if (_level === undefined){
      _level = 'INFO';
    }
    return this.log4js.connectLogger(this.log4js.getLogger('access'), { level: _level });
  }

  public accessInfo(message: unknown): void {
    const logger: Log4js.Logger = this.log4js.getLogger('access');
    logger.info(message);
  }

  public accessWarn(message: unknown): void {
    const logger: Log4js.Logger = this.log4js.getLogger('access');
    logger.warn(message);
  }

  public accessError(message: unknown): void {
    const logger: Log4js.Logger = this.log4js.getLogger('access');
    logger.error(message);
  }

  public systemInfo(message: unknown): void {
    const logger: Log4js.Logger = this.log4js.getLogger('system');
    logger.info(message);
  }

  public systemWarning(message: unknown): void {
    const logger: Log4js.Logger = this.log4js.getLogger('system');
    logger.warn(message);
  }

  public systemError(message: unknown): void {
    const logger: Log4js.Logger = this.log4js.getLogger('system');
    logger.error(message);
  }
  public debug(message: unknown): void {
    const logger: Log4js.Logger = this.log4js.getLogger();
    logger.error(message);
  }

  public trace(message: unknown): void {
    const logger: Log4js.Logger = this.log4js.getLogger();
    logger.trace(message);
  }
}

export default new Logger();