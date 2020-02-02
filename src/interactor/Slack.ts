import { VOUser } from '../valueobject/VOUser';
import { VOConfig } from '../valueobject/VOSlackConfig';
import { VOHomeApp } from '../valueobject/VOHomeApp';
import { HomeApp } from '../presenter/HomeApp';
import { Modal } from '../presenter/Modal';
import { VOModal } from '../valueobject/VOModal';

export class Slack {
  private slackConfig: VOConfig;
  private static _instance: Slack | null = null;
  public static get instance(): Slack | undefined {
    if (this._instance === null){
      const config: VOConfig | undefined = VOConfig.of();
      if (!config){
        return;
      }
      this._instance = new Slack(config);
      return this._instance;
    }
    return this._instance;
  }
  private constructor(config: VOConfig){
    this.slackConfig = config;
  }
  public async sendAppHome(user: VOUser): Promise<void> {
    const view: VOHomeApp = VOHomeApp.of(this.slackConfig, user);
    await HomeApp.displayHome(view);
  }
  public async updateAppHome(user: VOUser): Promise<void> {
    const view: VOHomeApp = VOHomeApp.of(this.slackConfig, user);
    await HomeApp.displayHome(view);
  }
  public async sendModal(modal: VOModal): Promise<void> {
    modal.ofToken(this.slackConfig);
    await Modal.send(modal);
  }
}
