import config from 'config';

import { Type } from '../../types/Type';
import { VOSpaceId } from './VOSpaceId';
import { QueryTeamToken, COLLECTEDTEAMS } from '../../repository/query/QueryTeamToken';

const queryTeamToken: QueryTeamToken = QueryTeamToken.instance;

type SLACKCONFIG = {
  signingSecret: string;
  token: string;
  clientId: string;
  clientSecret: string;
}

type OAUTHCONFIG = {
  client_id: string;
  client_secret: string;
}

export class VOConfig {
  private _conf: SLACKCONFIG;
  private serverHost: string;
  public static async of(spaceId?: VOSpaceId): Promise<VOConfig | undefined> {
    let _conf: SLACKCONFIG;
    const serverHost: string = config.get('serverHost');
    const teamId: string = config.get('defaultTeamId');
    const slackConfig: SLACKCONFIG = config.get('slack_config');

    try {
      _conf = {
        token: slackConfig.token,
        signingSecret: slackConfig.signingSecret,
        clientId: slackConfig.clientId,
        clientSecret: slackConfig.clientSecret
      };
    } catch (err) {
      require('dotenv').config();
      if (!process.env.slack_config){
        return;
      }
      _conf = JSON.parse(process.env.slack_config);
    }

    if (!Type.isPlainObject(_conf)){
      return;
    }
    if (!spaceId){
      return new VOConfig(_conf, serverHost);
    }

    if (teamId !== spaceId.toJson().space) {
      const collectedToken: Array<COLLECTEDTEAMS> = await queryTeamToken.extract(spaceId);
      _conf = {
        token: collectedToken[0].token,
        signingSecret: slackConfig.signingSecret,
        clientId: slackConfig.clientId,
        clientSecret: slackConfig.clientSecret
      };
    }

    return new VOConfig(_conf, serverHost);
  }
  private constructor(config: SLACKCONFIG, serverHost: string){
    this._conf = config;
    this.serverHost = serverHost;
  }
  public toString(): string {
    return JSON.stringify(this._conf);
  }
  public extractToken(): string {
    return this._conf.token;
  }
  public extractSigningSecret(): string {
    return this._conf.signingSecret;
  }
  public toJSON(): SLACKCONFIG {
    return this._conf;
  }

  public extractOAuthConfig(): OAUTHCONFIG {
    const config: OAUTHCONFIG = {
      'client_id': this._conf.clientId,
      'client_secret': this._conf.clientSecret,
    };
    return config;
  }

  public extractServerHost(): string {
    return this.serverHost;
  }
}
