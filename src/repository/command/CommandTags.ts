import monk, { ICollection } from 'monk';

import logger from '../../logger/LoggerBase';
import { VOTags, INPUTTAG } from '../../valueobject/VOTags';
import { VODBConfig } from '../../valueobject/database/VODBConfig';

export class CommandTags {
  private articles: ICollection;
  private static _instance: CommandTags | null = null;
  public static get instance(): CommandTags {
    if ( this._instance === null ) {
      const conf: VODBConfig = VODBConfig.default();
      const uri: string = conf.uriTostring();
      const db = monk(uri);
      const articles: ICollection = db.get('tags');
      this._instance = new CommandTags(articles);
      return this._instance;
    }
    return this._instance;
  }
  private constructor(articles: ICollection){
    this.articles = articles;
  }
  public async collect(tagData: VOTags): Promise<void> {
    const tag: Array<INPUTTAG> = tagData.toJsonArray();
    try {
      for (let i = 0; i <= CommandTags.length; i++){
        await this.articles.insert(tag[i]);
      }
      return;
    } catch (err) {
      logger.systemInfo('error happened at collect tag data');
      logger.systemError(err);
    }
  }
}
