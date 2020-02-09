/* eslint-disable @typescript-eslint/camelcase, camelcase */
import supertest from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';

import createWebhook from './webhook';

describe('Gitlab Webhook', () => {
  test('No token success', async () => {
    const router = createWebhook();
    const app = express();
    app.use(bodyParser.json());
    app.use(router);

    const response = await supertest(app)
      .post('/')
      .send({
        object_kind: 'note',
        object_attributes: {
          noteable_type: 'MergeRequest',
        },
      });

    expect(response.status).toEqual(200);
  });

  test('token fail', async () => {
    const router = createWebhook({ token: 'test_token' });
    const app = express();
    app.use(bodyParser.json());
    app.use(router);

    const response = await supertest(app)
      .post('/')
      .send({
        object_kind: 'note',
        object_attributes: {
          noteable_type: 'MergeRequest',
        },
      });

    expect(response.status).toEqual(401);
  });

  test('token success', async () => {
    const router = createWebhook({ token: 'test_token' });
    const app = express();
    app.use(bodyParser.json());
    app.use(router);

    const response = await supertest(app)
      .post('/')
      .set('X-Gitlab-Token', 'test_token')
      .send({
        object_kind: 'note',
        object_attributes: {
          noteable_type: 'MergeRequest',
        },
      });

    expect(response.status).toEqual(200);
  });
});
