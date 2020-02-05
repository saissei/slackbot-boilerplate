import config from 'config';
import monk, { ICollection } from 'monk';

import logger from '../../logger/LoggerBase';
import { VOUserSettings } from '../../valueobject/VOUserSettings';

interface DBCONFIG {
  host: string;
  port: string;
  database: string;
}


export class CommandUserSettings {
  private articles: ICollection;
  private static _instance: CommandUserSettings | null = null;
  public static get instance(): CommandUserSettings {
    if ( this._instance === null ) {
      const dbconfig = config.get<DBCONFIG>('database');
      const uri = `${dbconfig.host}:${dbconfig.port}/${dbconfig.database}`;
      const db = monk(uri);
      const articles: ICollection = db.get('usersettings');
      this._instance = new CommandUserSettings(articles);
      return this._instance;
    }
    return this._instance;
  }
  private constructor(articles: ICollection){
    this.articles = articles;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async collect(settings: VOUserSettings): Promise<any> {
    const collectData = settings.toJson();
    try {
      const result = await this.articles.insert(collectData);
      return result;
    } catch (err) {
      logger.systemError('error happened at collecton memo data');
      logger.systemError(err);
    }
  }
  public async update(collectionId: string, settings: VOUserSettings): Promise<any> {
    const collectData = {'$set': settings.toJson()};
    const updateId = { _id: collectionId };
    try {

      const result = await this.articles.update(updateId, collectData);

      return result;
    } catch (err) {
      logger.systemError('error happened at collecton memo data');
      logger.systemError(err);
    }
  }
}
