import { AUTHORIZEDDATA } from '../../interactor/Authorization';

export interface TEAMINFO {
  teamId: string;
  token: string;
  name: string;
}

export class VOAuthToken {
  private authorizedData: TEAMINFO;
  public static of(authorizedData: AUTHORIZEDDATA): VOAuthToken {
    return new VOAuthToken(authorizedData);
  }
  private constructor(authorizedData: AUTHORIZEDDATA){
    this.authorizedData = authorizedData;
  }
  public extractToken(): string {
    return this.authorizedData.token;
  }
  public toJson(): TEAMINFO {
    return this.authorizedData;
  }
}
