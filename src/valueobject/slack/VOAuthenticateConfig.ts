import { VOAuthenticateCode } from './VOAuthenticateCode';
import { VOConfig } from './VOSlackConfig';
import qs from 'qs';

interface AUTHCONFIG {
  client_id: string;
  client_secret: string;
  code: string;
  redirect_uri: string;
}

export class VOAuthenticateConfig {
  private authBody: AUTHCONFIG;
  public static of(config: VOConfig, authCode: VOAuthenticateCode): VOAuthenticateConfig {
    const code: string = authCode.toString();
    const clientConfig = config.extractOAuthConfig();
    const serverHost = config.extractServerHost();

    const authBody: AUTHCONFIG = {
      'client_id': clientConfig.client_id,
      'client_secret': clientConfig.client_secret,
      'redirect_uri': `https://${serverHost}/auth/redirect`,
      code: code
    };

    return new VOAuthenticateConfig(authBody);
  }
  private constructor(authBody: AUTHCONFIG){
    this.authBody = authBody;
  }
  public toJson(): AUTHCONFIG {
    return this.authBody;
  }
  public toQuery(): string {
    const query = qs.stringify(this.authBody);
    return query;
  }
}
