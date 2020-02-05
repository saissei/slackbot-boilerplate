import { Request, Response } from 'express';
import { Slack } from '../Slack';
import { VOUser } from '../../valueobject/VOUser';
import { VOSpaceId } from '../../valueobject/VOSpaceId';
import { USERSETTINGS } from '../../valueobject/VOUserSettings';
import { VODateTime } from '../../valueobject/VODateTime';
import { QueryUserSettings } from '../../repository/query/QueryUserSettings';
import logger from '../../logger/LoggerBase';
import moment = require('moment-timezone');

const slack: Slack | undefined = Slack.instance;
const querySettings: QueryUserSettings = QueryUserSettings.instance;

export class EventsHandler {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public static async switcher(req: Request, res: Response): Promise<void> {
    if (!slack){
      return;
    }
    if (req.body.type === 'url_verification'){
      res.send({ challenge: req.body.challenge });
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/camelcase
    const { type, user, view } = req.body.event;
    switch (type){
      case 'app_home_opened': {
        try {
          if (view === undefined){
            return;
          }
          const vospace: VOSpaceId = VOSpaceId.of(view.team_id);
          const vouser: VOUser = VOUser.of(user);
          const settings: Array<USERSETTINGS> = await querySettings.extract(vouser);
          const newUserSetting: () => VODateTime = (): VODateTime => {
            if (settings.length === 0){
              const timestamp: string = moment().format('YYYY-MM-DD');
              const vodate: VODateTime = VODateTime.of(timestamp);
              return vodate;
            }
            const vodate: VODateTime = VODateTime.of(settings[0].filterDate);
            return vodate;
          };

        await slack.sendAppHome(vouser, vospace, newUserSetting());
        return;
      } catch (err) {
          logger.systemError(err);
          return;
      }
      }
      default: {
        return;
      }
    }
  }
}
