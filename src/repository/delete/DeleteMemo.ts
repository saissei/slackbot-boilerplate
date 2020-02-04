import config from 'config';
import monk, { ICollection } from 'monk';

import logger from '../../logger/LoggerBase';
import { VOContentId, CONTENTID } from '../../valueobject/VOContentId';

interface DBCONFIG {
  host: string;
  port: string;
  database: string;
}

export class DeleteMemo {
  private articles: ICollection;
  private static _instance: DeleteMemo | null = null;
  public static get instance(): DeleteMemo {
    if ( this._instance === null ) {
      const dbconfig = config.get<DBCONFIG>('database');
      const uri = `${dbconfig.host}:${dbconfig.port}/${dbconfig.database}`;
      const db = monk(uri);
      const articles: ICollection = db.get('memo');
      this._instance = new DeleteMemo(articles);
      return this._instance;
    }
    return this._instance;
  }
  private constructor(articles: ICollection){
    this.articles = articles;
  }
  public async removeId(contentId: VOContentId): Promise<void>{
    try {
      const id: CONTENTID = contentId.toKeyValue();
      await this.articles.remove(id);
    } catch (err) {
      logger.systemInfo('error happened at extract memo id');
      logger.systemError(err);
      return;
    }
}
}
