import dotenv from 'dotenv';

if (process.env.NODE_ENV == 'testing') {
  dotenv.config({ path: '.env.testing' });
} else {
  dotenv.config();
}

import express, { NextFunction, Request, Response } from 'express';
import './util/passport';
import './util/helpers';
import multer from 'multer';
import logger from './util/logger';
import morganLogger from './middleware/morgan.middleware';
import routes from './routes';

import { ExpressAdapter } from '@bull-board/express';
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/BullMQAdapter';
import { mailQueue } from './queues/mail';

// Create an express app.
const app = express();

// Parse the application/json request body.
app.use(express.json());
// Parse the x-www-form-urlencoded request body.
app.use(express.urlencoded({ extended: true }));
// Parse the form-data request body.
app.use(multer().any());

// Log the incoming requests to console.
app.use(morganLogger);

// Register and mount the routes.
app.use('/', routes);

// Set up queue monitoring route.
const serverAdapter = new ExpressAdapter();

const { addQueue, removeQueue, setQueues, replaceQueues } = createBullBoard({
  queues: [new BullMQAdapter(mailQueue)],
  serverAdapter: serverAdapter
});

serverAdapter.setBasePath('/admin/queues');
app.use('/admin/queues', serverAdapter.getRouter());

// Catch any error and send it as a json.
app.use(function (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (error) {
    logger.error(error.message);
    return res.status(500).json({ error: error.message });
  }
});

// Catch 404.
app.use(function (req: Request, res: Response) {
  return res.status(404).json({ message: 'Page Not Found!' });
});

export default app;
