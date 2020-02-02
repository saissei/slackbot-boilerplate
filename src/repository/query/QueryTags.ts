import config from 'config';
import monk, { ICollection } from 'monk';

import { TAGS } from '../../valueobject/database/VODBTags';
import logger from '../../logger/LoggerBase';


interface DBCONFIG {
  host: string;
  port: string;
  database: string;
}

interface TAGSOBJECT {
  type: string;
  text: string;
  emoji: boolean;
}

export interface OPTIONTAGS {
  text: TAGSOBJECT;
  value: string;
}

export class QueryTags {
  private articles: ICollection;
  private static _instance: QueryTags | null = null;
  public static get instance(): QueryTags {
    if ( this._instance === null ) {
      const dbconfig = config.get<DBCONFIG>('database');
      const uri = `${dbconfig.host}:${dbconfig.port}/${dbconfig.database}`;
      const db = monk(uri);
      const articles: ICollection = db.get('tags');
      this._instance = new QueryTags(articles);
      return this._instance;
    }
    return this._instance;
  }
  private constructor(articles: ICollection){
    this.articles = articles;
  }
  public async extract(): Promise<Array<TAGS>> {
    try {
      const tag: Array<TAGS> = await this.articles.find();
      return tag;
    } catch (err) {
      logger.systemInfo('error happened at collect tag data');
      logger.systemError(err);
      return [];
    }
  }
}
