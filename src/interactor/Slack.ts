import { VOUser } from '../valueobject/VOUser';
import { VOConfig } from '../valueobject/VOSlackConfig';
import { VOHomeApp } from '../valueobject/VOHomeApp';
import { HomeApp } from '../presenter/HomeApp';
import { Modal } from '../presenter/Modal';
import { VOModal } from '../valueobject/VOModal';
import { VOSpaceId } from '../valueobject/VOSpaceId';
import { QueryMemo, COLLECTED } from '../repository/query/QueryMemo';
import { VOAppHomeContent } from '../valueobject/VOAppHomeContent';

const query: QueryMemo = QueryMemo.instance;

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
  public async sendAppHome(user: VOUser, space: VOSpaceId ): Promise<void> {
    const memo: Array<COLLECTED> = await query.extractAll(space);
    const homeContents: VOAppHomeContent = VOAppHomeContent.of(memo);
    // console.log(homeContents.toArray());

    const view: VOHomeApp = VOHomeApp.of(this.slackConfig, user, homeContents);
    await HomeApp.displayHome(view);
  }
  public async updateAppHome(user: VOUser, space: VOSpaceId): Promise<void> {
    const memo: Array<COLLECTED> = await query.extractAll(space);
    const homeContents: VOAppHomeContent = VOAppHomeContent.of(memo);
    const view: VOHomeApp = VOHomeApp.of(this.slackConfig, user, homeContents);
    await HomeApp.displayHome(view);
  }
  public async sendModal(modal: VOModal): Promise<void> {
    modal.ofToken(this.slackConfig);
    try {
      await Modal.send(modal);
    } catch (err) {
      console.log(err);
      return;
    }
  }
}
