import express, { Request, Response } from 'express';
import { EventsHandler } from '../controller/routesHander/EventsHandler';
import { ActionsHandler } from '../controller/routesHander/ActionsHandler';
import { AuthenticationHandler } from '../controller/routesHander/AuthentictionHandler';

const router: express.Router = express.Router();
// const slack: App = new Bolt(salckConfig);

router.get('/health', (req: Request, res: Response) => {
  res.sendStatus(200);
});

router.get('/authDummy', (req: Request, res: Response) => {
  res.sendStatus(200);
});

router.post('/slack/events', async(req: Request, res: Response) => {
  EventsHandler.switcher(req, res);
});

router.post('/slack/action', async(req: Request, res: Response) => {
  ActionsHandler.switcher(req, res);
});

router.get('/auth/redirect', async(req: Request, res: Response) => {
  AuthenticationHandler.switcher(req, res);
});

export { router };
