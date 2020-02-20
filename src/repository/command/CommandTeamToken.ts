import monk, { ICollection } from 'monk';
import { VODBConfig } from '../../valueobject/database/VODBConfig';
import { VOAuthToken, TEAMINFO } from '../../valueobject/slack/VOAuthToken';
import logger from '../../logger/LoggerBase';

export class CommandTeamToken {
  private articles: ICollection;
  private static _instance: CommandTeamToken | null = null;
  public static get instance(): CommandTeamToken {
    if ( this._instance === null ) {
      const conf: VODBConfig = VODBConfig.default();
      const uri: string = conf.uriTostring();
      const db = monk(uri);
      const articles: ICollection = db.get('teams');
      this._instance = new CommandTeamToken(articles);
      return this._instance;
    }
    return this._instance;
  }
  private constructor(articles: ICollection){
    this.articles = articles;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async collect(data: VOAuthToken): Promise<any> {
    const collectData: TEAMINFO = data.toJson();
    try {
      const result = await this.articles.insert(collectData);
      return result;
    } catch (err) {
      logger.systemError('erroe happened at collecton authentication data');
      logger.systemError(err);
    }
  }
}
