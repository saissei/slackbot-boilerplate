import { Request, Response } from "express";
import { Slack } from "interactor/Slack";
import { VOUser } from "valueobject/VOUser";
const slack: Slack = Slack.instance;

export class EventsHandler {
  public static async switcher(req: Request, res: Response): Promise<void> {
    const {type, user, channel, tab, text, subtype} = req.body.event;
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