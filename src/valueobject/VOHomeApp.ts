import { VOUser } from './VOUser';
import { VOConfig } from './VOConfig';

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
    const blocks = [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "*Welcome!* \nThis is a home for Stickers app. You can add small notes here!"
        },
        accessory: {
          type: "button",
          action_id: "add_note",
          text: {
            type: "plain_text",
            text: "Add a Stickie"
          }
        }
      },
      {
        type: "divider"
      }
    ];

    const view = {
      type: 'home',
      title: {
        type: 'plain_text',
        text: 'Keep notes!'
      },
      blocks: blocks
    }
    const hpmeApp: HOMECONFIG = {
      token: this.config.extractToken(),
      user_id: this.user.toString(),
      view: JSON.stringify(view)
    }
    return hpmeApp;
  };
}