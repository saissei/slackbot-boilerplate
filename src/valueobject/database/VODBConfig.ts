import config from 'config';

export interface DBCONFIG {
  host: string;
  port: string;
  database: string;
  username: string;
  password: string;
}

export class VODBConfig {
  private uri: string;
  public static default(): VODBConfig {
    const dbconfig: DBCONFIG = config.get<DBCONFIG>('database');
    if (dbconfig.username !== undefined && dbconfig.password !== undefined){
      const uri = `${dbconfig.username}:${dbconfig.password}@${dbconfig.host}:${dbconfig.port}/${dbconfig.database}`;
      return new VODBConfig(uri);
    }
    const uri = `${dbconfig.host}:${dbconfig.port}/${dbconfig.database}`;
    return new VODBConfig(uri);
  }
  private constructor(uri: string){
    this.uri = uri;
  }
  public uriTostring(): string {
    return this.uri;
  }
}
