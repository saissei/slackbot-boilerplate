import { Slack } from '../../interactor/Slack';
import { PlainObject } from '../../types/PlainObject';
import { VOUser } from '../../valueobject/VOUser';

const slack: Slack | undefined = Slack.instance;

interface NOTE {
    type: string;
    block_id: string;
    label: PlainObject;
    optional: false;
    element: PlainObject;
}

interface NOTESTATE {
  values: PlainObject;
}

interface SUBMITVIEW {
  id: string;
  team_id: string;
  type: string;
  blocks: Array<NOTE>;
  private_metadata: string;
  callback_id: string;
  state: NOTESTATE;
  hash: string;
  title: PlainObject;
  clear_on_close: boolean;
  notify_on_close: boolean;
  submit: PlainObject;
  root_view_id: string;
  app_id: string;
  external_id: string;
  app_installed_team_id: string;
  bot_id: string;
}

export class SubmissionController {
  public static async handle(vouser: VOUser, view: SUBMITVIEW): Promise<void> {
    const callbackId: string = view.callback_id;
      switch (callbackId){
        case 'add_note': {
          console.log(view.state.values);
          console.log('addNote!');
          if ( slack === undefined) {
            return;
          }
          await slack.updateAppHome(vouser);
          return;
        }
        default: {
          return;
        }
    }
  }
}
