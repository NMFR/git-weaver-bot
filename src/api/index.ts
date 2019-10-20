import express from 'express';
import bodyParser from 'body-parser';

import rest from './rest';

const port = 3000;

export function start() {
  const app = express();

  app.use(bodyParser.json());

  app.use(rest);

  app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
  });

  return app;
}

export default start;
