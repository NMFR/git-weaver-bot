import fs from 'fs';
import { Readable } from 'stream';

import { readableToString } from '../common/io/readable';
import Api from './Api';
import ProviderMapConfig from './ProviderMapConfig';

export default interface Config {
  readonly logLevel: string;
  readonly api: Api;
  readonly providerMap: ProviderMapConfig;
}

export async function createConfigFromStream(stream: Readable): Promise<Config> {
  const str = await readableToString(stream);
  const json = JSON.parse(str);

  return {
    logLevel: json?.logLevel ?? 'info',
    api: {
      hostname: json?.api?.hostname ?? 'localhost',
      port: json?.api?.port || 3000,
    },
    providerMap: json?.providers ?? {},
  };
}

export async function createConfigFromFile(filePath: string): Promise<Config> {
  const stream = fs.createReadStream(filePath);
  return createConfigFromStream(stream);
}
