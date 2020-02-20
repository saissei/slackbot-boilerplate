import { SUBMITVIEW } from '../controller/buttonHandler/SubmissionController';
import { VOUser } from './slack/VOUser';
import moment from 'moment-timezone';
import { VOUserName } from './VOUserName';

export interface COLLECTED extends COLLECTIONDATA {
  timestamp: string;
  update: string;
}

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
export interface COLLECTIONDATA {
  space: string;
  userId: string;
  userName: string;
  title: string;
  url: string;
  tag: Array<string>;
  description: string;
  detail: string;
  timestamp?: string;
  update?: string;
}

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
interface INPUTMEMO extends COLLECTIONDATA {
  timestamp: string;
  update: string;
}

export class VOMemo {
  private memo: INPUTMEMO;
  public static of(view: SUBMITVIEW, userId: VOUser, userName: VOUserName): VOMemo {
    const viewData = view.state.values;
    const now: string = moment().toISOString();
    const httpRegex = new RegExp('^(https?:\\/\\/)?((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*(\\?[;&a-z\\d%_.~+=-]*)?(\\#[-a-z\\d_]*)?$','i');
    const url = (): string => {
      if (httpRegex.test(viewData.url.data.value)) {
        return viewData.url.data.value;
      }
      return '';
    };
    const tags = (): Array<string> => {
      if (viewData.tags.tags.selected_options.length === 0){
        return [];
      }
      return viewData.tags.tags.selected_options.map(item => {
        return item.value;
      });
    };
    const memo: INPUTMEMO = {
      'space': view.team_id,
      'userId': userId.toString(),
      'userName': userName.toString(),
      'tag': tags(),
      'title': viewData.title.data.value,
      'url': url(),
      'description': viewData.description.data.value,
      'detail': viewData.memo.data.value,
      'timestamp': now,
      'update': now
    };
    return new VOMemo(memo);
  }
  private constructor(memo: INPUTMEMO){
    this.memo = memo;
  }
  public toJson(): INPUTMEMO {
    return this.memo;
  }
}
