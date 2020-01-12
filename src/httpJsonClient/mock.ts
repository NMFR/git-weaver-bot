import HttpJsonClient, { Options, Response } from './client';

export default class MockHttpJsonClient extends HttpJsonClient {
  requestOptions: Options;

  requestFn?: (options: Options) => Response;

  response: Response;

  async request(options: Options): Promise<Response> {
    this.requestOptions = options;

    return this.requestFn ? this.requestFn(options) : this.response;
  }
}
