import { COLLECTED } from '../repository/query/QueryMemo';
import moment = require('moment-timezone');

interface RULEDLINE {
  'type': string;
};

interface ACCESSORYCONTENT {
  type: string;
  text: string;
}

interface ACCESSORY {
  'type': string;
  'action_id': string;
  'text': ACCESSORYCONTENT;
}

interface TITLEBLOCK {
  'type': string;
  'text': string;
}

interface MULTIACTION {
  'type': string;
  'elements': Array<any>;
}

interface CONTENTBLOCK {
  'type': string;
  'text': TITLEBLOCK;
  'accessory': ACCESSORY;
}

export type BLOCKCONTENT = Array<RULEDLINE | CONTENTBLOCK | MULTIACTION>

export class VOAppHomeContent {
  private contents: BLOCKCONTENT;
  public static of(collection: Array<COLLECTED>): VOAppHomeContent {

    const contents: Array<CONTENTBLOCK | any> = collection.map((item: COLLECTED) => {
      let contentBody = '';
      const timestamp: string = moment(item.update).tz('Asia/tokyo').format('YYYY-MM-DD HH:mm:ss');
      if ( item.url !== ''){
        contentBody = `*${item.title}*\n${item.url}\n_${item.description}_\n------------------------------------\n${item.detail}\n------------------------------------\n_Created by: <${item.userName}>  at:${timestamp}_\n _tag: ${JSON.stringify(item.tag)}_`;
      }
      if ( item.url === ''){
        contentBody = `*${item.title}*\n_${item.description}_\n------------------------------------\n${item.detail}\n------------------------------------\n  _Created by: ${item.userName},  at:${timestamp}_\n_ tag: ${JSON.stringify(item.tag)}_`;
      }
      const content: BLOCKCONTENT = [{
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: contentBody
        }
      },
      {
        'type': 'actions',
        'elements': [
          {
            'type': 'button',
            'action_id': `Edit=${item._id}`,
            'text': {
              'type': 'plain_text',
              'text': 'Edit'
            }
          },
          {
            'type': 'button',
            'action_id': `Delete=${item._id}`,
            'text': {
              'type': 'plain_text',
              'text': 'Delete'
            }
          },
        ]
      },
      {
        type: 'divider'
      }
    ];
      return content;
    });
    const extractContents = (): Array<CONTENTBLOCK> => {
      const arr: Array<CONTENTBLOCK> = [];
      for (let i = 0; i < contents.length; i++){
        arr.push(contents[i][0]);
        arr.push(contents[i][1]);
        arr.push(contents[i][2]);
      }
      return arr;
    };
    return new VOAppHomeContent(extractContents());
  }

  private constructor(contents: Array<CONTENTBLOCK>){
    this.contents = contents;
  }
  public toArray(): BLOCKCONTENT {
    return this.contents;
  }
}
