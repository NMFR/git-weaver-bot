import { Readable } from 'stream';
import ProviderMapConfig from './ProviderMapConfig';

export default interface Config {
  readonly hostname?: string;
  readonly port?: number;
  readonly providerMap: ProviderMapConfig;
}

async function stream2string(stream: Readable): Promise<string> {
  const chunks = [];

  for await (const chunk of stream) {
    chunks.push(chunk);
  }

  if (chunks.length === 0) {
    return '';
  }

  if (typeof chunks[0] === 'string') {
    return chunks.join();
  }

  return Buffer.concat(chunks).toString();
}

export async function createConfig(stream: Readable): Promise<Config> {
  const str = await stream2string(stream);
  const json = JSON.parse(str);

  return {
    hostname: json?.hostname ?? 'localhost',
    port: json?.port || 3000,
    providerMap: json?.providers ?? {},
  };
}
