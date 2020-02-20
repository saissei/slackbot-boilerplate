import { Slack } from '../Slack';
import { PlainObject } from '../../types/PlainObject';
import { VOUser } from '../../valueobject/slack/VOUser';
import { VOMemo } from '../../valueobject/VOMemo';
import { CommandMemo } from '../../repository/command/CommandMemo';
import { VOSpaceId } from '../../valueobject/slack/VOSpaceId';
import { VOUserName } from '../../valueobject/VOUserName';
import { USERSETTINGS } from '../../valueobject/VOUserSettings';
import { QueryUserSettings } from '../../repository/query/QueryUserSettings';
import { VODateTime } from '../../valueobject/VODateTime';
import { VOTags } from '../../valueobject/VOTags';
import moment = require('moment-timezone');
import { CommandTags } from '../../repository/command/CommandTags';

const cmdMemo: CommandMemo = CommandMemo.instance;
const cmdTags: CommandTags = CommandTags.instance;
const querySettings: QueryUserSettings = QueryUserSettings.instance;

interface VALUEDATA {
  type: string;
  value: string;
}

interface VIEWARRAYDATA {
  type: string;
  selected_options: Array<VALUEDATA>;
}

interface TAGVALUE {
  tags: VIEWARRAYDATA;
}

interface VALUE {
  data: VALUEDATA;
}
interface MODALVALUE {
  title: VALUE;
  url: VALUE;
  description: VALUE;
  memo: VALUE;
  tags: TAGVALUE;
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

interface TAGSTATE {
  values: TAGVALUE;
}

export interface SUBMITTAGVIEW {
  id: string;
  team_id: string;
  type: string;
  blocks: Array<NOTE>;
  private_metadata: string;
  callback_id: string;
  state: TAGSTATE;
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
  public static async handle(vouserName: VOUserName, vouser: VOUser, view: any): Promise<void> {

    const space: VOSpaceId = VOSpaceId.of(view.team_id);
    const slack: Slack | undefined = await Slack.of(space);
    if ( slack === undefined ) {
      return;
    }

    const settings: Array<USERSETTINGS> = await querySettings.extract(vouser);
    const userSetting: () => VODateTime = (): VODateTime => {
      if (settings.length === 0){
        const timestamp: string = moment().format('YYYY-MM-DD');
        const vodate: VODateTime = VODateTime.of(timestamp);
        return vodate;
      }
      const vodate: VODateTime = VODateTime.of(settings[0].filterDate);
      return vodate;
    };

    const callbackId: string = view.callback_id;
      switch (callbackId){
        case 'add_note': {
          const memo: VOMemo = VOMemo.of(view, vouser, vouserName);
          await cmdMemo.collect(memo);
          await slack.sendAppHome(vouser, space, userSetting());
          return;
        }

        case 'add_tag': {
          const tags: VOTags = VOTags.of(view);
          await cmdTags.collect(tags);
          await slack.sendAppHome(vouser, space, userSetting());
          return;
        }

        default: {
          return;
        }
    }
  }
}
