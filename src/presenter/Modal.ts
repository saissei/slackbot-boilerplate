import qs from 'qs';
import axios from 'axios';

import logger from '../logger/LoggerBase';
import { VONoteModal } from '../valueobject/VONoteModal';
import { VOTagModal } from '../valueobject/VOTagModal';

const url = 'https://slack.com/api';


export class Modal {
  public static async send(modal: VONoteModal|VOTagModal): Promise<void> {
    try {
      await axios.post(`${url}/views.open`, qs.stringify(modal.toJSON()));
    } catch (err) {
      logger.systemError(err);
    }
  }
}
