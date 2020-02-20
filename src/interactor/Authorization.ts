import axios, { AxiosResponse } from 'axios';

import logger from '../logger/LoggerBase';
import { VOAuthenticateConfig } from '../valueobject/slack/VOAuthenticateConfig';

export interface AUTHORIZEDDATA {
  token: string;
  teamId: string;
  name: string;
};

export class Authorization {
  public static async accessRequest(authConfig: VOAuthenticateConfig): Promise<AUTHORIZEDDATA | undefined> {
    try {
      const url = 'https://slack.com/api/oauth.v2.access';
      const authBody = authConfig.toQuery();

      const header = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      };

      const authResult: AxiosResponse = await axios.post(url, authBody, header);

      if ( authResult.data.ok === false) {
        logger.systemError('request access token is failed');
        return;
      }
      const accessToken: string = authResult.data.access_token;
      const teamId: string = authResult.data.team.id;
      const teamName: string = authResult.data.team.name;
      const authorized: AUTHORIZEDDATA = {
        token: accessToken,
        teamId: teamId,
        name: teamName
      };
      return authorized;

    } catch (err) {
      logger.systemError('request access token is failed');
      logger.systemError(err);
      return ;
    }
  }
}

