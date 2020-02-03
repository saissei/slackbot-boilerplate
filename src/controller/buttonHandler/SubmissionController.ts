import { Slack } from '../../interactor/Slack';
import { PlainObject } from '../../types/PlainObject';
import { VOUser } from '../../valueobject/VOUser';
import { VOMemo } from '../../valueobject/VOMemo';
import { CommandMemo } from '../../repository/command/CommandMemo';
import { VOCollection } from '../../valueobject/database/VOCollection';

const slack: Slack | undefined = Slack.instance;
const cmdMemo: CommandMemo = CommandMemo.instance;

interface VALUEDATA {
  type: string;
  value: string;
}

interface VALUE {
  data: VALUEDATA;
}
interface MODALVALUE {
  title: VALUE;
  url: VALUE;
  description: VALUE;
  memo: VALUE;
}

interface NOTE {
    type: string;
    block_id: string;
    label: PlainObject;
    optional: false;
    element: PlainObject;
}

interface NOTESTATE {
  values: MODALVALUE;
}

export interface SUBMITVIEW {
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
          if ( slack === undefined ) {
            return;
          }
          console.log('addNote!');
          const memo: VOMemo = VOMemo.of(view, vouser);
          const collectionData: VOCollection = VOCollection.of(memo);
          const commandResult = await cmdMemo.collect(collectionData);
          console.log(commandResult);
          await slack.updateAppHome(vouser);
          return;
        }
        default: {
          return;
        }
    }
  }
}
