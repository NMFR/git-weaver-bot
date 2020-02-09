import { RequestHandler } from 'express';

export default interface GitProvider {
  readonly type: string;
  readonly name: string;
  readonly webhook?: RequestHandler;
}
