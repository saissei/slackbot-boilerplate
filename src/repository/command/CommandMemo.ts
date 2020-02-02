import config from 'config';
import monk, { ICollection } from 'monk';

import logger from '../../logger/LoggerBase';
import { VOCollection, COLLECTED,  } from '../../valueobject/database/VOCollection';


interface DBCONFIG {
  host: string;
  port: string;
  database: string;
}


export class CommandMemo {
  private articles: ICollection;
  private static _instance: CommandMemo | null = null;
  public static get instance(): CommandMemo {
    if ( this._instance === null ) {
      const dbconfig = config.get<DBCONFIG>('database');
      const uri = `${dbconfig.host}:${dbconfig.port}/${dbconfig.database}`;
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

  public async collect(data: VOCollection): Promise<void> {
    const collectData: COLLECTED = data.toCollectData();
    try {
      await this.articles.insert(collectData);
      return;
    } catch (err) {
      logger.systemError('erroe happened at collecton memo data');
      logger.systemError(err);
    }
  }
}
