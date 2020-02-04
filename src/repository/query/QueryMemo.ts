import config from 'config';
import monk, { ICollection } from 'monk';
import { Moment } from 'moment';

import logger from '../../logger/LoggerBase';
import { VOSpaceId, SPACEID } from '../../valueobject/VOSpaceId';
import { VOContentId, CONTENTID } from '../../valueobject/VOContentId';
import { VODateTime, UPDATEKEYVALUE } from '../../valueobject/VODateTime';

interface DBCONFIG {
  host: string;
  port: string;
  database: string;
}

export interface COLLECTED {
  _id: string;
  space: string;
  userId: string;
  userName: string;
  title: string;
  url: string;
  tag: Array<string>;
  description: string;
  detail: string;
  timestamp: string;
  update: string;
}

export class QueryMemo {
    private articles: ICollection;
    private static _instance: QueryMemo | null = null;
    public static get instance(): QueryMemo {
      if ( this._instance === null ) {
        const dbconfig = config.get<DBCONFIG>('database');
        const uri = `${dbconfig.host}:${dbconfig.port}/${dbconfig.database}`;
        const db = monk(uri);
        const articles: ICollection = db.get('memo');
        this._instance = new QueryMemo(articles);
        return this._instance;
      }
      return this._instance;
    }
    private constructor(articles: ICollection){
      this.articles = articles;
    }
    public async extractAll(spaceId: VOSpaceId): Promise<Array<COLLECTED>>{
        try {
          const space: SPACEID = spaceId.toJson();
          const memo: Array<COLLECTED> = await this.articles.find(space);
          return memo;
        } catch (err) {
          logger.systemInfo('error happened at query memo data');
          logger.systemError(err);
          return [];
        }
    }
    public async findbyId(spaceId: VOSpaceId, contentId: VOContentId): Promise<Array<COLLECTED>>{
      try {
        const space: SPACEID = spaceId.toJson();
        const id: CONTENTID = contentId.toKeyValue();
        const memo: Array<COLLECTED> = await this.articles.find({space,id});
        return memo;
      } catch (err) {
        logger.systemInfo('error happened at extract memo id');
        logger.systemError(err);
        return [];
      }
  }
  public async filterbyDate(spaceId: VOSpaceId, timestamp: VODateTime): Promise<Array<COLLECTED>>{
    try {
      const space: SPACEID = spaceId.toJson();
      const updateDate: UPDATEKEYVALUE = timestamp.toUpdateKeyValue();
      const memo: Array<COLLECTED> = await this.articles.find({space,updateDate});
      return memo;
    } catch (err) {
      logger.systemInfo('error happened at extract memo id');
      logger.systemError(err);
      return [];
    }
}
}
