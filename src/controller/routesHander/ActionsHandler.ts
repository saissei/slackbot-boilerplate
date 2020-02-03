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

const slack: Slack | undefined = Slack.instance;
const query: QueryTags = QueryTags.instance;

export class ActionsHandler {
  public static async switcher(req: Request, res: Response): Promise<void>{
    if (!slack){
      return;
    }

    // eslint-disable-next-line @typescript-eslint/camelcase, @typescript-eslint/no-unused-vars
    const { token, trigger_id, user, actions, type } = JSON.parse(req.body.payload);
    const voTriggerId: VOTriggerId = VOTriggerId.of(trigger_id);
    const tags: Array<TAGS> = await query.extract();
    const optionTags: VOOptionTags = VOOptionTags.of(tags);
    const voModal: VOModal = VOModal.stickieModal(voTriggerId, optionTags);
    const voActions: VOActions | undefined = VOActions.of(actions);
    /** action typeによってactionの内容を確認 */
    if (type === 'view_submission'){

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { user, view } = JSON.parse(req.body.payload);
      res.send('');
      const vouser: VOUser = VOUser.of(user.id);
      await SubmissionController.handle(vouser, view);
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

    switch (actionObject.action_id) {
      case 'add_note':{
        await slack.sendModal(voModal);
        return;
      }
      case 'filter_date': {
        console.log('filter_date!');
        return;
      }
      default:
        return;
    }
  }
}
