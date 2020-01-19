import express from 'express';
import * as path from 'path';
import cookieParser from 'cookie-parser';
import  logger from '../logger/LoggerBase';
import helmet from 'helmet';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const connectLogger: any = logger.connectLogger('INFO')

import { router as apiRouter } from '../routes/Api';

class App {
  public express: express.Application = express();

  constructor() {
    this.middleWareInit();
    this.routerInit();
  }

  /**
   * middleware系初期化
   */
  private middleWareInit(): void {
    // view engine setup
    this.express.set('views', path.join(__dirname, '../../views'));
    this.express.set('view engine', 'pug');

    this.express.use(helmet());
    this.express.use(connectLogger);
    this.express.use(express.json());

    this.express.use(express.urlencoded({ extended: false }));
    this.express.use(cookieParser());
    this.express.use(express.static(path.join(__dirname, '../../public')));
    this.express.use(express.static(path.join(__dirname, '../../node_modules')));

  }

  /**
   * router初期化
   */
  private routerInit(): void {
    this.express.use('/', apiRouter);
  }
}

// appをexport
export default new App().express;
