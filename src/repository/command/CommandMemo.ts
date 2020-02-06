import monk, { ICollection } from 'monk';
import { VOMemo, COLLECTED } from '../../valueobject/VOMemo';
import { VODBConfig } from '../../valueobject/database/VODBConfig';

import logger from '../../logger/LoggerBase';

export class CommandMemo {
  private articles: ICollection;
  private static _instance: CommandMemo | null = null;
  public static get instance(): CommandMemo {
    if ( this._instance === null ) {
      const conf: VODBConfig = VODBConfig.default();
      const uri: string = conf.uriTostring();
      const db = monk(uri);
      const articles: ICollection = db.get('memo');
      this._instance = new CommandMemo(articles);
      return this._instance;
    }
    return this._instance;
  }
  private constructor(articles: ICollection){
    this.articles = articles;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async collect(data: VOMemo): Promise<any> {
    const collectData: COLLECTED = data.toJson();
    try {
      const result = await this.articles.insert(collectData);
      return result;
    } catch (err) {
      logger.systemError('erroe happened at collecton memo data');
      logger.systemError(err);
    }
  }
}
