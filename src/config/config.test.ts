import path from 'path';
import { Readable } from 'stream';

import { createConfigFromStream, createConfigFromFile } from './Config';

describe('Config', () => {
  test('Success from string', async () => {
    const stream = Readable.from([
      '{"logLevel": "verbose","api":{"hostname": "localhost", "port": 80}, "providers": {"gitlab":{"type": "gitlab","apiAuthToken": "mock","webhookToken": "TEST_TOKEN"}}}',
    ]);
    const config = await createConfigFromStream(stream);

    expect(config).toEqual({
      logLevel: 'verbose',
      api: {
        hostname: 'localhost',
        port: 80,
      },
      providerMap: { gitlab: { type: 'gitlab', apiAuthToken: 'mock', webhookToken: 'TEST_TOKEN' } },
    });
  });

  test('Success from file', async () => {
    const config = await createConfigFromFile(path.join(__dirname, './config.test.json'));

    expect(config).toEqual({
      logLevel: 'verbose',
      api: {
        hostname: 'localhost',
        port: 80,
      },
      providerMap: { gitlab: { type: 'gitlab', apiAuthToken: 'mock', webhookToken: 'TEST_TOKEN' } },
    });
  });
});
