/* eslint-disable import/prefer-default-export */
import { Readable } from 'stream';

export async function readableToString(stream: Readable): Promise<string> {
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
