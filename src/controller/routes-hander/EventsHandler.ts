import { Request, Response } from 'express';
import { Slack } from '../../interactor/Slack';
import { VOUser } from '../../valueobject/VOUser';
const slack: Slack = Slack.instance;

export class EventsHandler {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public static async switcher(req: Request, res: Response): Promise<void> {
    switch(req.body.type){
      case 'url_verification': {
        res.send({ challenge: req.body.challenge });
        return;
      }
      default:{
        console.log(req.body.event)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { type, user }: { type: string; user: string } = req.body.event;
        switch(type){
          case 'app_home_opened': {
            const vouser: VOUser = VOUser.of(user);
            await slack.sendAppHome(vouser);
            return;
          }
          default: {
            return;
          }
        }
      }
    }
  }
}