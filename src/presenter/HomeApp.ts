import axios from 'axios';
import qs from 'qs';

import logger from '../logger/LoggerBase';
import { VOHomeApp } from 'valueobject/VOHomeApp';

const url = 'https://slack.com/api'

export class HomeApp {

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  public static async displayHome(homeApp: VOHomeApp, data?: any): Promise<void> {
    try {
      await axios.post(`${url}/views.publish`, qs.stringify(homeApp.updateView()));
    } catch(err) {
      logger.systemError(err);
    }
  };
}