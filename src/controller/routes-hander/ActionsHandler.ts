import { Request, Response } from 'express';
import { VOTriggerId } from '../../valueobject/VOTriggerId';
import { VOActions } from '../../valueobject/VOActions';
import { VOModal } from '../../valueobject/VOModal';
import { Slack } from '../../interactor/Slack';
import logger from '../../logger/LoggerBase';

const slack: Slack = Slack.instance;

export class ActionsHandler {
  public static async switcher(req: Request, res: Response): Promise<void>{
    // eslint-disable-next-line @typescript-eslint/camelcase, @typescript-eslint/no-unused-vars
    const { token, trigger_id, user, actions, type } = JSON.parse(req.body.payload);
    const voTriggerId: VOTriggerId = VOTriggerId.of(trigger_id);
    const voModal: VOModal = VOModal.ofTriggerId(voTriggerId);
    const voActions: VOActions = VOActions.of(actions);

    /** action typeによってactionの内容を確認 */
    if(type === 'view_submission'){
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { user, view } = JSON.parse(req.body.payload);
      res.sendStatus(200);
      logger.systemInfo(view);
      return;
    }

    if(voActions.checkArraylength() === 0){
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const actionObject: any = voActions.extractObject();

    switch (actionObject.action_id) {
      case 'add_note':{
        voModal.stickieModal();
        await slack.sendModal(voModal);
        return;
      }
      default:
        return;
    }
  }
}