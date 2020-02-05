import axios from 'axios';
import qs from 'qs';

import logger from '../logger/LoggerBase';
import { VOHomeApp } from '../valueobject/VOHomeApp';
import { VODateTime } from '../valueobject/VODateTime';

const url = 'https://slack.com/api';

export class HomeApp {

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  public static async displayHome(homeApp: VOHomeApp, setting: VODateTime): Promise<void> {
    try {
      const view = homeApp.updateView(setting);
      await axios.post(`${url}/views.publish`, qs.stringify(view));
      return;
    } catch (err) {
      logger.systemError(err);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  public static async updateHome(homeApp: VOHomeApp, setting: VODateTime): Promise<void> {
    try {
      const view = homeApp.updateView(setting);
      console.log(view);
      await axios.post(`${url}/views.update`, qs.stringify(view));
      return;
    } catch (err) {
      logger.systemError(err);
    }
  };
}
