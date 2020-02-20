import { VOTriggerId } from './VOTriggerId';
import { VOConfig } from './slack/VOSlackConfig';

type MODAL = {
  token?: string;
  trigger_id: string;
  view: string;
};

export class VOTagModal {
  private modal: MODAL;

  public static tagModal(triggerId: VOTriggerId): VOTagModal {
    const modal = {
      'type': 'modal',
      'callback_id': 'add_tag',
      'title': {
        'type': 'plain_text',
        'text': 'MEMO APP'
      },
      'submit': {
        'type': 'plain_text',
        'text': 'Create'
      },
      'blocks': [
        {
          'type': 'input',
          'block_id': 'tags',
          'element': {
            'type': 'plain_text_input',
            'action_id': 'data',
            'placeholder': {
              'type': 'plain_text',
              'text': ' '
            }
          },
          'label': {
            'type': 'plain_text',
            'text': 'New Tags'
          },
          'hint': {
            'type': 'plain_text',
            'text': '複数ある場合はカンマ区切りで入力してください'
          }
        }
      ]
    };

    const footer = [{
      'type': 'divider'
    },
    {
      'type': 'context',
      'elements': [
        {
          'type': 'mrkdwn',
          'text': '*Author: issei.kariya from Zerobillbank*'
        }
      ]
    }];

    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    modal.blocks.push(...footer);

    const args: MODAL = {
      'trigger_id': triggerId.toString(),
      view: JSON.stringify(modal)
    };
    return new VOTagModal(args);
  }

  private constructor(modal: MODAL){
    this.modal = modal;
  }

  public ofToken(voconfig: VOConfig): void {
    if (this.modal){
      this.modal.token = voconfig.extractToken();
      return;
    }
  }
  public toJSON(): MODAL | undefined {
    if (this.modal){
      return this.modal;
    }
    return;
  }
}
