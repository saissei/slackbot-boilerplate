import { VOTriggerId } from './VOTriggerId';
import { VOConfig } from './VOSlackConfig';
import { VOOptionTags } from './VOOptionTags';

type MODAL = {
  token?: string;
  trigger_id: string;
  view: string;
};

export class VOModal {
  private modal: MODAL;

  public static stickieModal(triggerId: VOTriggerId, tags: VOOptionTags): VOModal {
    const modal = {
      'type': 'modal',
      'callback_id': 'add_note',
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
          'block_id': 'title',
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
            'text': 'Title'
          },
          'hint': {
            'type': 'plain_text',
            'text': ' '
          }
        },
        {
          'type': 'input',
          'block_id': 'url',
          'element': {
            'type': 'plain_text_input',
            'action_id': 'data',
            'placeholder': {
              'type': 'plain_text',
              'text': 'http://example.com'
            }
          },
          'label': {
            'type': 'plain_text',
            'text': 'Scrap address'
          },
          'hint': {
            'type': 'plain_text',
            'text': 'メモしたいアドレスがあれば入力してください。\nもしない場合、何か１文字だけ文字入力を行ってください。\n※http以外から始まった文字列はは記録されません'
          }
        },
        {
          'type': 'input',
          'block_id': 'description',
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
            'text': 'Description'
          },
          'hint': {
            'type': 'plain_text',
            'text': 'URLリンクやひとくちメモ'
          }
        },
        {
          'type': 'input',
          'block_id': 'memo',
          'element': {
            'type': 'plain_text_input',
            'action_id': 'data',
            'multiline': true,
            'placeholder': {
              'type': 'plain_text',
              'text': ' '
            }
          },
          'label': {
            'type': 'plain_text',
            'text': 'Memo'
          },
          'hint': {
            'type': 'plain_text',
            'text': ' '
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
    const optiontag = tags.toJson();
    if (optiontag.length !== 0){
      const selectOption = {
        'type': 'section',
        'block_id': 'tags',
        'text': {
          'type': 'mrkdwn',
          'text': 'タグを選択して下さい'
        },
        'accessory': {
          'type': 'multi_static_select',
          'block_id': 'data',
          'placeholder': {
            'type': 'plain_text',
            'text': 'Select items',
            'emoji': true
          },
          'options': optiontag
        }
      };
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      modal.blocks.push(selectOption);
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    modal.blocks.push(...footer);

    const args: MODAL = {
      // eslint-disable-next-line @typescript-eslint/camelcase
      trigger_id: triggerId.toString(),
      view: JSON.stringify(modal)
    };
    return new VOModal(args);
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
