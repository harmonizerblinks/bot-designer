import express, { Application } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';
import { getRootPath } from './misc';

export const startServer = (port: number = 3000): Application => {
  const app: Application = express();

  app.use(morgan('tiny'));

  app.use(cors());

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  app.use('/', express.static(getRootPath()));

  const PORT = process.env.PORT || port;
  // eslint-disable-next-line no-console
  app.listen(PORT, () => console.log(`[✓] Running on port ${PORT}`));

  return app;
};
