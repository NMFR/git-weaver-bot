import express, { Express, RequestHandler } from 'express';
import bodyParser from 'body-parser';

import version from './routes/version';

export interface CreateServerOptions {
  hostname?: string;
  port?: number;
  webhooks?: RequestHandler;
}
const defaultCreateServerOptions: CreateServerOptions = { hostname: 'localhost', port: 3000 };

export function createServer(options?: CreateServerOptions): Express {
  const optionsWithDefaults: CreateServerOptions = { ...defaultCreateServerOptions, ...options };

  const app = express();

  app.use(bodyParser.json());

  app.get('/version', version);

  if (optionsWithDefaults.webhooks) {
    app.use('/webhooks', optionsWithDefaults.webhooks);
  }

  app.listen(optionsWithDefaults.port, optionsWithDefaults.hostname, () => {
    console.info(`server started at http://${optionsWithDefaults.hostname}:${optionsWithDefaults.port}`);
  });

  return app;
}

export default createServer;
