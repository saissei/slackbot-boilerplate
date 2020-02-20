import monk, { ICollection } from 'monk';

import { USERSETTINGS } from '../../valueobject/VOUserSettings';
import logger from '../../logger/LoggerBase';
import { VOUser, SEARCHKEY } from '../../valueobject/slack/VOUser';
import { VODBConfig } from '../../valueobject/database/VODBConfig';

export interface COLLECTEDSETTING extends USERSETTINGS {
  _id: string;
}

export class QueryUserSettings {
  private articles: ICollection;
  private static _instance: QueryUserSettings | null = null;
  public static get instance(): QueryUserSettings {
    if ( this._instance === null ) {
      const conf: VODBConfig = VODBConfig.default();
      const uri: string = conf.uriTostring();
      const db = monk(uri);
      const articles: ICollection = db.get('usersettings');
      this._instance = new QueryUserSettings(articles);
      return this._instance;
    }
    return this._instance;
  }
  private constructor(articles: ICollection){
    this.articles = articles;
  }
  public async extract(userId: VOUser): Promise<Array<COLLECTEDSETTING>> {
    try {
      const kv: SEARCHKEY = userId.toSearchKey();
      const settings: Array<COLLECTEDSETTING> = await this.articles.find(kv);
      return settings;
    } catch (err) {
      logger.systemInfo('error happened at query tag data');
      logger.systemError(err);
      return [];
    }
  }
}
