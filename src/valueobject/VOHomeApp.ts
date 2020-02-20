import { VOUser } from './slack/VOUser';
import { VOConfig } from './slack/VOSlackConfig';
import { VOAppHomeContent, BLOCKCONTENT } from './VOAppHomeContent';
import { VODateTime } from './VODateTime';

type HOMECONFIG = {
  token: string;
  user_id: string;
  view: string;
};

export class VOHomeApp {
  private user: VOUser;
  private config: VOConfig;
  private content: VOAppHomeContent;
  public static of(config: VOConfig, user: VOUser, homeContent: VOAppHomeContent): VOHomeApp {
    return new VOHomeApp(config, user, homeContent);
  }
  private constructor(config: VOConfig, user: VOUser, homeContent: VOAppHomeContent){
    this.user = user;
    this.config = config;
    this.content = homeContent;
  }
  public updateView(setting: VODateTime): HOMECONFIG {

    const initDate: string = setting.extractYearDate();
    const contents: BLOCKCONTENT = this.content.toArray();
    const blocks = [
      {
        'type': 'section',
        'text': {
          'type': 'mrkdwn',
          'text': '*Welcome!*\n\n'
        },
        'accessory': {
          'type': 'button',
          'action_id': 'add_note',
          'text': {
            'type': 'plain_text',
            'text': 'New note'
          }
        }
      },
      {
        'type': 'section',
        'text': {
          'type': 'mrkdwn',
          'text': ' '
        },
        'accessory': {
          'type': 'button',
          'action_id': 'add_tag',
          'text': {
            'type': 'plain_text',
            'text': 'New tag'
          }
        }
      },
      {
        type: 'divider'
      },
      {
        'type': 'actions',
        'elements': [
          {
            'type': 'datepicker',
            'initial_date': initDate,
            'action_id': 'filter_date',
            'placeholder': {
              'type': 'plain_text',
              'text': '日付',
              'emoji': true
            }
          }
        ]
      }
    ];
    if (contents.length !== 0){
      blocks.push(...contents);
    }
    const view = {
      type: 'home',
      title: {
        type: 'plain_text',
        text: 'Keep notes!'
      },
      blocks: blocks
    };

    const hpmeApp: HOMECONFIG = {
      token: this.config.extractToken(),
      // eslint-disable-next-line @typescript-eslint/camelcase
      user_id: this.user.toString(),
      view: JSON.stringify(view)
    };
    return hpmeApp;
  };
}
