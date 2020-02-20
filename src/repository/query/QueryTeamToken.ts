import monk, { ICollection } from 'monk';

import logger from '../../logger/LoggerBase';
import { VODBConfig } from '../../valueobject/database/VODBConfig';
import { VOSpaceId, SEARCHKEY } from '../../valueobject/slack/VOSpaceId';
import { TEAMINFO } from '../../valueobject/slack/VOAuthToken';

export interface COLLECTEDTEAMS extends TEAMINFO {
  _id: string;
}

export class QueryTeamToken {
  private articles: ICollection;
  private static _instance: QueryTeamToken | null = null;
  public static get instance(): QueryTeamToken {
    if ( this._instance === null ) {
      const conf: VODBConfig = VODBConfig.default();
      const uri: string = conf.uriTostring();
      const db = monk(uri);
      const articles: ICollection = db.get('teams');
      this._instance = new QueryTeamToken(articles);
      return this._instance;
    }
    return this._instance;
  }
  private constructor(articles: ICollection){
    this.articles = articles;
  }
  public async extract(teamId: VOSpaceId): Promise<Array<COLLECTEDTEAMS>> {
    try {
      const kv: SEARCHKEY = teamId.toSearchKey();
      const settings: Array<COLLECTEDTEAMS> = await this.articles.find(kv);
      return settings;
    } catch (err) {
      logger.systemInfo('error happened at query teams data');
      logger.systemError(err);
      return [];
    }
  }
}
