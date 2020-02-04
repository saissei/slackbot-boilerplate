import { Request, Response } from 'express';
import { VOTriggerId } from '../../valueobject/VOTriggerId';
import { VOActions } from '../../valueobject/VOActions';
import { VOModal } from '../../valueobject/VOModal';
import { Slack } from '../../interactor/Slack';
// import logger from '../../logger/LoggerBase';
import { SubmissionController } from '../buttonHandler/SubmissionController';
import { QueryTags } from '../../repository/query/QueryTags';
import { TAGS } from '../../valueobject/database/VODBTags';
import { VOOptionTags } from '../../valueobject/VOOptionTags';
import { VOUser } from '../../valueobject/VOUser';
import { VOSpaceId } from '../../valueobject/VOSpaceId';
import { DeleteMemo } from '../../repository/delete/DeleteMemo';
import { VOContentId } from '../../valueobject/VOContentId';
import { VOUserName } from '../../valueobject/VOUserName';
import { VODateTime } from '../../valueobject/VODateTime';
import { VOUserSettings } from '../../valueobject/VOUserSettings';

const slack: Slack | undefined = Slack.instance;
const queryTags: QueryTags = QueryTags.instance;
const deleteMemo: DeleteMemo = DeleteMemo.instance;
export class ActionsHandler {
  public static async switcher(req: Request, res: Response): Promise<void>{
    if (!slack){
      return;
    }

    // eslint-disable-next-line @typescript-eslint/camelcase, @typescript-eslint/no-unused-vars
    const { token, trigger_id, user, actions, type, team } = JSON.parse(req.body.payload);

    const voTriggerId: VOTriggerId | undefined = VOTriggerId.of(trigger_id);
    if (voTriggerId === undefined){
      return;
    }
    const space: VOSpaceId = VOSpaceId.of(team.id);
    const tags: Array<TAGS> = await queryTags.extract(space);
    const optionTags: VOOptionTags = VOOptionTags.of(tags);
    const voModal: VOModal = VOModal.stickieModal(voTriggerId, optionTags);
    const voActions: VOActions | undefined = VOActions.of(actions);
    /** action typeによってactionの内容を確認 */
    if (type === 'view_submission'){

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { user, view } = JSON.parse(req.body.payload);
      console.log(user);
      res.send('');
      const vouserId: VOUser = VOUser.of(user.id);
      const vouserName: VOUserName = VOUserName.of(user.username);
      await SubmissionController.handle(vouserName, vouserId, view);
      // logger.systemInfo(view.state.values);
      return;
    }
    if (voActions === undefined){
      return;
    }


    if (voActions.checkArraylength() === 0){
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const actionObject: any = voActions.extractObject();
    if (/^Delete_*/.test(actionObject.action_id)) {
      console.log('delete');
      const contentId: VOContentId = VOContentId.of((actionObject.action_id).split('=')[1]);
      await deleteMemo.removeId(contentId);
      await slack.sendAppHome(user, space);
      res.send('');
      return;
    }
    switch (actionObject.action_id) {
      case 'add_note':{
        await slack.sendModal(voModal);
        return;
      }
      case 'filter_date': {
        console.log('filter_date!');
        const actionObject = voActions.extractObject();
        const filterDate = VODateTime.of(actionObject.selected_date);
        const vouserId: VOUser = VOUser.of(user.id);
        const userSettings = VOUserSettings.of(vouserId, filterDate);
        console.log(userSettings);
        return;
      }
      default:
        return;
    }
  }
}
