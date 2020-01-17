import { VOUser } from "./VOUser";

export class VOHomeApp {
  private user: string;
  public static of(user: VOUser): VOHomeApp {
    return new VOHomeApp(user.toString());
  }
  private constructor(user: string){
    this.user = user;
  }
  public updateView(): string {
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
    return JSON.stringify(view);
  };
}