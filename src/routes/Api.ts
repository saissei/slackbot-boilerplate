import express, { Request, Response } from 'express';
import { EventsHandler } from '../controller/routes-hander/EventsHandler';
import { ActionsHandler } from '../controller/routes-hander/ActionsHandler';

const router: express.Router = express.Router();
// const slack: App = new Bolt(salckConfig);

router.post('/slack/events', async(req: Request, res: Response) => {
    EventsHandler.switcher(req, res);
});

router.post('/slack/actions', async(req: Request, res: Response) => {
  ActionsHandler.switcher(req, res);
});

export { router };