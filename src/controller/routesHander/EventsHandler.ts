import { Request, Response } from 'express';
import { Slack } from '../../interactor/Slack';
import { VOUser } from '../../valueobject/VOUser';
import { VOSpaceId } from '../../valueobject/VOSpaceId';
const slack: Slack | undefined = Slack.instance;

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
    console.log(req.body.event);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/camelcase
    const { type, user, team_id }: { type: string; user: string; team_id: string } = req.body.event;
    switch (type){
      case 'app_home_opened': {
        const vospace: VOSpaceId = VOSpaceId.of(team_id);
        const vouser: VOUser = VOUser.of(user);
        await slack.sendAppHome(vouser, vospace);
        return;
      }
      default: {
        return;
      }
    }
  }
}
