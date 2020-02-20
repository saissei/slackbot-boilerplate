import { VOUser } from '../valueobject/slack/VOUser';
import { VOConfig } from '../valueobject/slack/VOSlackConfig';
import { VOHomeApp } from '../valueobject/VOHomeApp';
import { HomeApp } from '../presenter/HomeApp';
import { Modal } from '../presenter/Modal';
import { VONoteModal } from '../valueobject/VONoteModal';
import { VOSpaceId } from '../valueobject/slack/VOSpaceId';
import { QueryMemo, COLLECTED } from '../repository/query/QueryMemo';
import { VOAppHomeContent } from '../valueobject/VOAppHomeContent';
import { VODateTime } from '../valueobject/VODateTime';
import logger from '../logger/LoggerBase';
import { VOTagModal } from '../valueobject/VOTagModal';

const query: QueryMemo = QueryMemo.instance;

export class Slack {
  private slackConfig: VOConfig;
  public static async of(teamId: VOSpaceId): Promise<Slack | undefined> {
    const config: VOConfig | undefined = await VOConfig.of(teamId);
    if (!config){
        return;
    }
    return new Slack(config);
  }
  private constructor(config: VOConfig){
    this.slackConfig = config;
  }

  public async sendAppHome(user: VOUser, space: VOSpaceId, setting: VODateTime ): Promise<void> {

    try {
      const memo: Array<COLLECTED> = await query.extractAll(space, user, setting);
      const filtered = memo.filter(item => {
        if (item.tag.length === 0){
          return item;
        };
        let check;
        for (let i = 0; i <= item.tag.length - 1; i++ ){
          if (item.tag[i].toLowerCase() === 'private'){
            check = true;
          }
        }
        if ( check === true && item.userId === user.toString()){
          return item;
        }
        if (!check) {
          return item;
        }
      });
      const homeContents: VOAppHomeContent = VOAppHomeContent.of(filtered);
      const view: VOHomeApp = VOHomeApp.of(this.slackConfig, user, homeContents);
      await HomeApp.displayHome(view, setting);
    } catch (err){
      logger.systemError(err);
    }
  }

  public async updateAppHome(user: VOUser, space: VOSpaceId, setting: VODateTime): Promise<void> {
    const memo: Array<COLLECTED> = await query.extractAll(space, user, setting);
    const homeContents: VOAppHomeContent = VOAppHomeContent.of(memo);
    const view: VOHomeApp = VOHomeApp.of(this.slackConfig, user, homeContents);
    await HomeApp.updateHome(view, setting);
  }

  public async sendNewNoteModal(modal: VONoteModal|VOTagModal): Promise<void> {
    modal.ofToken(this.slackConfig);
    try {
      await Modal.send(modal);
    } catch (err) {
      logger.systemError(err);
      return;
    }
  }
  public async sendNewtagModal(modal: VONoteModal|VOTagModal): Promise<void> {
    modal.ofToken(this.slackConfig);
    try {
      await Modal.send(modal);
    } catch (err) {
      logger.systemError(err);
      return;
    }
  }
}
