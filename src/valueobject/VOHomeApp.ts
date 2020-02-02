import { VOUser } from './VOUser';
import { VOConfig } from './VOSlackConfig';
import moment from 'moment-timezone';

type HOMECONFIG = {
  token: string;
  user_id: string;
  view: string;
};

export class VOHomeApp {
  private user: VOUser;
  private config: VOConfig;
  public static of(config: VOConfig, user: VOUser): VOHomeApp {
    return new VOHomeApp(config, user);
  }
  private constructor(config: VOConfig, user: VOUser){
    this.user = user;
    this.config = config;
  }
  public updateView(): HOMECONFIG {
    const today: string = moment().tz('Asia/tokyo').format('YYYY-MM-DD');
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
            'text': 'Add a Stickie'
          }
        }
      },
      {
        type: 'divider'
      },
      {
        'type': 'section',
        'text': {
          'type': 'mrkdwn',
          'text': ' '
        },
        'accessory': {
          'type': 'datepicker',
          'initial_date': today,
          'action_id': 'filter_date',
          'placeholder': {
            'type': 'plain_text',
            'text': 'filter_date',
            'emoji': true
          }
        }
      }
    ];

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
