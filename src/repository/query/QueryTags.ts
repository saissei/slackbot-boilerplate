import config from 'config';
import monk, { ICollection } from 'monk';

import logger from '../../logger/LoggerBase';
import { VOSpaceId, SPACEID } from '../../valueobject/VOSpaceId';


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

export interface COLLECTEDDBTAGS {
  _id: string;
  space: string;
  tag: string;
  timestamp: string;
  update: string;
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
  public async extract(spaceId: VOSpaceId): Promise<Array<COLLECTEDDBTAGS>> {
    try {
      const space: SPACEID = spaceId.toJson();
      const tag: Array<COLLECTEDDBTAGS> = await this.articles.find(space);
      return tag;
    } catch (err) {
      logger.systemInfo('error happened at query tag data');
      logger.systemError(err);
      return [];
    }
  }
}
