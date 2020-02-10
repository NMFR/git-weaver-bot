import path from 'path';
import fs from 'fs';
import { Readable } from 'stream';

import { createConfig } from './Config';

describe('Config', () => {
  test('Success from string', async () => {
    const stream = Readable.from(['{"hostname": "localhost", "port": 80, "providers": {"gitlab":{"test":1}}}']);
    const config = await createConfig(stream);

    expect(config).toEqual({ hostname: 'localhost', port: 80, providerMap: { gitlab: { test: 1 } } });
  });

  test('Success from file', async () => {
    const stream = fs.createReadStream(path.join(__dirname, './config.test.json'));
    const config = await createConfig(stream);

    expect(config).toEqual({ hostname: 'localhost', port: 80, providerMap: { gitlab: { test: 1 } } });
  });
});
