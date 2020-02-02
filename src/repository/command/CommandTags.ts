import config from 'config';
import monk, { ICollection } from 'monk';

import logger from '../../logger/LoggerBase';
import { VODBTags, TAGS } from '../../valueobject/database/VODBTags';

interface DBCONFIG {
  host: string;
  port: string;
  database: string;
}

export class CommandTags {
  private articles: ICollection;
  private static _instance: CommandTags | null = null;
  public static get instance(): CommandTags {
    if ( this._instance === null ) {
      const dbconfig = config.get<DBCONFIG>('database');
      const uri = `${dbconfig.host}:${dbconfig.port}/${dbconfig.database}`;
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
  public async collect(tagData: VODBTags): Promise<void> {
    const tag: TAGS = tagData.toJson();
    try {
      await this.articles.insert(tag);
      return;
    } catch (err) {
      logger.systemInfo('error happened at collect tag data');
      logger.systemError(err);
    }
  }
}
