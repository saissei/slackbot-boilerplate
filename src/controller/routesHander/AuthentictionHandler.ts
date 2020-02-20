import { Request, Response } from 'express';

import logger from '../../logger/LoggerBase';
import { VOConfig } from '../../valueobject/slack/VOSlackConfig';
import { VOAuthenticateCode } from '../../valueobject/slack/VOAuthenticateCode';
import { VOAuthenticateConfig } from '../../valueobject/slack/VOAuthenticateConfig';
import { Authorization } from '../../interactor/Authorization';
import { VOAuthToken } from '../../valueobject/slack/VOAuthToken';
import { CommandTeamToken } from '../../repository/command/CommandTeamToken';

const commandToken: CommandTeamToken = CommandTeamToken.instance;

export class AuthenticationHandler {
  public static async switcher(req: Request, res: Response): Promise<void> {


    const code: VOAuthenticateCode = VOAuthenticateCode.of(req.query.code);
    const config: VOConfig | undefined = await VOConfig.of();
    if (config === undefined){
      logger.systemError('slack config is not found');
      return;
    }
    const authBody: VOAuthenticateConfig = VOAuthenticateConfig.of(config, code);
    const getToken = await Authorization.accessRequest(authBody);
    logger.systemInfo(getToken);

    if (getToken === undefined){
      return;
    }

    const accessToken: VOAuthToken = VOAuthToken.of(getToken);
    logger.systemInfo(accessToken);
    res.redirect('/authDummy');
    commandToken.collect(accessToken);
  }
}
