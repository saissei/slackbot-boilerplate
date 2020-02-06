import monk, { ICollection } from 'monk';

import logger from '../../logger/LoggerBase';
import { VOContentId, CONTENTID } from '../../valueobject/VOContentId';
import { VODBConfig } from '../../valueobject/database/VODBConfig';

export class DeleteMemo {
  private articles: ICollection;
  private static _instance: DeleteMemo | null = null;
  public static get instance(): DeleteMemo {
    if ( this._instance === null ) {
      const conf: VODBConfig = VODBConfig.default();
      const uri: string = conf.uriTostring();
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
