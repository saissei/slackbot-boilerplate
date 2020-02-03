import { COLLECTIONDATA } from "./database/VOCollection";
import { SUBMITVIEW } from "../controller/buttonHandler/SubmissionController";
import { VOUser } from "./VOUser";
import moment, { Moment } from 'moment-timezone';

interface INPUTMEMO extends COLLECTIONDATA {
  timestamp: Moment,
  update: Moment
}

export class VOMemo {
  private memo: INPUTMEMO;
  public static of(view: SUBMITVIEW, userId: VOUser): VOMemo {
    const viewData = view.state.values;
    const now: Moment = moment().tz('Asia/tokyo');
    const httpRegex = new RegExp('^(https?:\\/\\/)?((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*(\\?[;&a-z\\d%_.~+=-]*)?(\\#[-a-z\\d_]*)?$','i');
    const url = () => {
      if (httpRegex.test(viewData.url.data.value)) {
        return viewData.url.data.value;
      }
      return '';
    }
    const memo: INPUTMEMO = {
      'space': view.team_id,
      'tag': [],
      'title': viewData.title.data.value,
      'url': url(),
      'userId': userId.toString(),
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
