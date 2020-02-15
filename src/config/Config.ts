import { Readable } from 'stream';

import { readableToString } from '../common/io/readable';
import Api from './Api';
import ProviderMapConfig from './ProviderMapConfig';

export default interface Config {
  readonly api: Api;
  readonly providerMap: ProviderMapConfig;
}

export async function createConfig(stream: Readable): Promise<Config> {
  const str = await readableToString(stream);
  const json = JSON.parse(str);

  return {
    api: {
      hostname: json?.api?.hostname ?? 'localhost',
      port: json?.api?.port || 3000,
    },
    providerMap: json?.providers ?? {},
  };
}
