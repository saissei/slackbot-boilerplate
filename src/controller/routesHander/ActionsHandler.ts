import { Request, Response } from 'express';
import { VOTriggerId } from '../../valueobject/VOTriggerId';
import { VOActions } from '../../valueobject/VOActions';
import { VONoteModal } from '../../valueobject/VONoteModal';
import { Slack } from '../Slack';
// import logger from '../../logger/LoggerBase';
import { SubmissionController } from '../buttonHandler/SubmissionController';
import { QueryTags } from '../../repository/query/QueryTags';
import { CommandUserSettings } from '../../repository/command/CommandUserSettings';
import { VOOptionTags } from '../../valueobject/VOOptionTags';
import { VOUser } from '../../valueobject/VOUser';
import { VOSpaceId } from '../../valueobject/VOSpaceId';
import { DeleteMemo } from '../../repository/delete/DeleteMemo';
import { VOContentId } from '../../valueobject/VOContentId';
import { VOUserName } from '../../valueobject/VOUserName';
import { VODateTime } from '../../valueobject/VODateTime';
import { VOUserSettings, USERSETTINGS } from '../../valueobject/VOUserSettings';
import { QueryUserSettings, COLLECTEDSETTING } from '../../repository/query/QueryUserSettings';
import { VOTagModal } from '../../valueobject/VOTagModal';
import moment = require('moment-timezone');
import logger from '../../logger/LoggerBase';

const slack: Slack | undefined = Slack.instance;
const queryTags: QueryTags = QueryTags.instance;
const commandSettings: CommandUserSettings = CommandUserSettings.instance;
const deleteMemo: DeleteMemo = DeleteMemo.instance;
const querySettings: QueryUserSettings = QueryUserSettings.instance;

export class ActionsHandler {
  public static async switcher(req: Request, res: Response): Promise<void>{
    if (!slack){
      return;
    }

    // eslint-disable-next-line @typescript-eslint/camelcase
    const { trigger_id, user, actions, type, team } = JSON.parse(req.body.payload);
    const voTriggerId: VOTriggerId | undefined = VOTriggerId.of(trigger_id);
    if (voTriggerId === undefined){
      return;
    }
    const space: VOSpaceId = VOSpaceId.of(team.id);
    const tags = await queryTags.extract(space);
    const optionTags: VOOptionTags = VOOptionTags.of(tags);
    const vouserId: VOUser = VOUser.of(user.id);
    const vouserName: VOUserName = VOUserName.of(user.username);
    const voActions: VOActions | undefined = VOActions.of(actions);
    /** action typeによってactionの内容を確認 */
    if (type === 'view_submission'){

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { view } = JSON.parse(req.body.payload);
      res.send('');
      await SubmissionController.handle(vouserName, vouserId, view);
      return;
    }
    if (voActions === undefined){
      return;
    }


    if (voActions.checkArraylength() === 0){
      return;
    }

    const settings: Array<USERSETTINGS> = await querySettings.extract(vouserId);
    const userSetting: () => VODateTime = (): VODateTime => {
      if (settings.length === 0){
        const timestamp: string = moment().tz('Asia/tokyo').format('YYYY-MM-DD');
        const vodate: VODateTime = VODateTime.of(timestamp);
        return vodate;
      }
      const collectedDate: string = moment(settings[0].filterDate).tz('Asia/tokyo').format('YYYY-MM-DD');
      const vodate: VODateTime = VODateTime.of(collectedDate);
      return vodate;
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const actionObject: any = voActions.extractObject();
    if (/^Delete_*/.test(actionObject.action_id)) {
      const contentId: VOContentId = VOContentId.of((actionObject.action_id).split('=')[1]);
      await deleteMemo.removeId(contentId);

      await slack.sendAppHome(vouserId, space, userSetting());
      res.send('');
      return;
    }
    switch (actionObject.action_id) {
      case 'add_note':{
        res.send('');
        const voModal: VONoteModal = VONoteModal.stickieModal(voTriggerId, optionTags);
        await slack.sendNewNoteModal(voModal);
        return;
      }
      case 'add_tag':{
        res.send('');
        const voModal: VOTagModal = VOTagModal.tagModal(voTriggerId);
        await slack.sendNewtagModal(voModal);
        return;
      }
      case 'filter_date': {
        console.log('filter_date!');
        const actionObject = voActions.extractObject();
        const filterDate = VODateTime.of(actionObject.selected_date);
        const vouserId: VOUser = VOUser.of(user.id);
        const newUserSettings = VOUserSettings.of(vouserId, filterDate);
        const oldSetting: Array<COLLECTEDSETTING> = await querySettings.extract(vouserId);
        if (oldSetting.length === 0){
          await commandSettings.collect(newUserSettings);
        }
        if (oldSetting.length !== 0){
          await commandSettings.update(oldSetting[0]._id, newUserSettings);
        }

        try {
          res.send('');
          await slack.sendAppHome(vouserId, space, userSetting());
        } catch (err) {
          logger.systemError(err);
        }

        return;
      }
      default:
        return;
    }
  }
}
