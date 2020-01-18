import config from 'config';

import { VOUser } from "../valueobject/VOUser";
import { VOConfig } from '../valueobject/VOConfig';
import { VOHomeApp } from "../valueobject/VOHomeApp";
import { HomeApp } from "../presenter/HomeApp";
import { Modal } from 'presenter/Modal';
import { VOModal } from 'valueobject/VOModal';

type SLACKCONFIG = {
  signingSecret: string;
  token: string;
}

const slackConfig: SLACKCONFIG = config.get('slack_config');

export class Slack {
  private slackConfig: VOConfig;
  private static _instance: Slack | null = null;
  public static get instance(): Slack {
    if(this._instance === null){
      this._instance = new Slack();
      return this._instance;
    }
    return this._instance;
  }
  private constructor(){
    this.slackConfig = VOConfig.of(slackConfig);
  }
  public async sendAppHome(user: VOUser): Promise<void> {
    const view: VOHomeApp = VOHomeApp.of(this.slackConfig, user);
    await HomeApp.displayHome(view);
  }
  public async sendModal(modal: VOModal): Promise<void> {
    await Modal.send(modal);
  }
}