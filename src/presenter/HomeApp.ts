import axios from 'axios';
import qs from 'qs';
import config from 'config';
import { Type } from '../types/Type';
import { VOHomeApp } from 'valueobject/VOHomeApp';
import logger from '../logger/LoggerBase';
import { VOUser } from 'valueobject/VOUser';

type SLACKCONFIG = {
  signingSecret: string;
  token: string;
}

type HOMECONFIG = {
  token: string;
  user: string;
  view?: string;
};

const slackConfig: SLACKCONFIG = config.get('slack_config');

export class HomeApp {
  private slackConfig: HOMECONFIG;
  public static ofUser(user: VOUser): HomeApp {
    if(!Type.isString(user)){
      return;
    }
    return new HomeApp(user)
  }
  public constructor(user: string){
    this.slackConfig = { token: slackConfig.token, user }
  }
  public async displayHome(homeApp: VOHomeApp): Promise<void> {
    try {
      this.slackConfig.view = await homeApp.updateView();
      await axios.post('/views.publish', qs.stringify(this.slackConfig));
    } catch(err) {
      logger.systemError(err);
    }
  };
}