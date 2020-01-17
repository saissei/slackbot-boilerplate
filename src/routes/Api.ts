import express, { Request, Response } from 'express';
import { EventsHandler } from 'controller/routes-hander/EventsHandler';

const router: express.Router = express.Router();
// const slack: App = new Bolt(salckConfig);

router.post('/slack/events', async(req: Request, res: Response) => {
  const {type, user, channel, tab, text, subtype} = req.body.event;

  if(type === 'app_home_opened') {
    EventsHandler.home({type, user, channel, tab, text, subtype});
  }
})



export { router };