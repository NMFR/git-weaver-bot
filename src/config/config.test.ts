import path from 'path';
import fs from 'fs';
import { Readable } from 'stream';

import { createConfig } from './Config';

describe('Config', () => {
  test('Success from string', async () => {
    const stream = Readable.from([
      '{"api":{"hostname": "localhost", "port": 80}, "providers": {"gitlab":{"type": "gitlab","apiAuthToken": "mock","webhookToken": "TEST_TOKEN"}}}',
    ]);
    const config = await createConfig(stream);

    expect(config).toEqual({
      api: {
        hostname: 'localhost',
        port: 80,
      },
      providerMap: { gitlab: { type: 'gitlab', apiAuthToken: 'mock', webhookToken: 'TEST_TOKEN' } },
    });
  });

  test('Success from file', async () => {
    const stream = fs.createReadStream(path.join(__dirname, './config.test.json'));
    const config = await createConfig(stream);

    expect(config).toEqual({
      api: {
        hostname: 'localhost',
        port: 80,
      },
      providerMap: { gitlab: { type: 'gitlab', apiAuthToken: 'mock', webhookToken: 'TEST_TOKEN' } },
    });
  });
});
