import axios from 'axios';
import qs from 'qs';

import logger from '../logger/LoggerBase';
import { VOHomeApp } from '../valueobject/VOHomeApp';

const url = 'https://slack.com/api';

export class HomeApp {

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  public static async displayHome(homeApp: VOHomeApp, data?: any): Promise<void> {
    try {
      console.log(qs.stringify(homeApp.updateView()));
      await axios.post(`${url}/views.publish`, qs.stringify(homeApp.updateView()));
      return;
    } catch (err) {
      logger.systemError(err);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  public static async updateHome(homeApp: VOHomeApp, data?: any): Promise<void> {
    try {
      await axios.post(`${url}/views.update`, qs.stringify(homeApp.updateView()));
      return;
    } catch (err) {
      logger.systemError(err);
    }
  };
}
