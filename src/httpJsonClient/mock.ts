import HttpJsonClient, { Options, Response } from './client';

export default class MockHttpJsonClient extends HttpJsonClient {
  requestOptions: Options;

  callCount = 0;

  requestFn?: (options: Options) => Response;

  response: Response;

  async request(options: Options): Promise<Response> {
    this.requestOptions = options;

    this.callCount += 1;

    return this.requestFn ? this.requestFn(options) : this.response;
  }
}
