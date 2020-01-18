import { VOTriggerId } from "./VOTriggerId";

type MODAL = {
  token?: string;
  trigger_id: string;
  view: string;
};

export class VOModal {
  private modal: MODAL;
  private triggerId: VOTriggerId;
  public static ofTriggerId(triggerId: VOTriggerId): VOModal {
    return new VOModal(triggerId);
  }
  private constructor(triggerId: VOTriggerId){
    this.triggerId = triggerId;
  }
  public stickieModal(): VOModal {
    const modal = {
      type: 'modal',
      title: {
        type: 'plain_text',
        text: 'Create a stickie note'
      },
      submit: {
        type: 'plain_text',
        text: 'Create'
      },
      blocks: [
        {
          "type": "input",
          "block_id": "note01",
          "label": {
            "type": "plain_text",
            "text": "Note"
          },
          "element": {
            "action_id": "content",
            "type": "plain_text_input",
            "placeholder": {
              "type": "plain_text",
              "text": "Take a note... "
            },
            "multiline": true
          }
        },
        {
          "type": "input",
          "block_id": "note02",
          "label": {
            "type": "plain_text",
            "text": "Color",
          },
          "element": {
            "type": "static_select",
            "action_id": "color",
            "options": [
              {
                "text": {
                  "type": "plain_text",
                  "text": "yellow"
                },
                "value": "yellow"
              },
              {
                "text": {
                  "type": "plain_text",
                  "text": "blue"
                },
                "value": "blue"
              }
            ]
          }
        }
      ]
    };

    const args: MODAL = {
      trigger_id: this.triggerId.toString(),
      view: JSON.stringify(modal)
    };
    this.modal = args;
    return;
  }
  public toJSON(): MODAL {
    return this.modal;
  }
}