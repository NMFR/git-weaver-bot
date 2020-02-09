export type Json = any;

export interface Headers {
  [status: string]: string;
}

export enum Method {
  OPTIONS = 'OPTIONS',
  HEAD = 'HEAD',
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
  LINK = 'LINK',
  UNLINK = 'UNLINK',
}

export interface Options {
  url: string;
  method: Method;
  headers?: Headers;
  data?: Json;
}

export interface Response {
  status: number;
  headers?: Headers;
  data?: Json;
}

export default abstract class HttpJsonClient {
  abstract async request(options: Options): Promise<Response>;

  async options(url: string, headers?: Headers): Promise<Response> {
    return this.request({ url, method: Method.OPTIONS, headers });
  }

  async head(url: string, headers?: Headers): Promise<Response> {
    return this.request({ url, method: Method.HEAD, headers });
  }

  async get(url: string, headers?: Headers): Promise<Response> {
    return this.request({ url, method: Method.GET, headers });
  }

  async post(url: string, data?: any, headers?: Headers): Promise<Response> {
    return this.request({ url, method: Method.POST, headers, data });
  }

  async put(url: string, data?: any, headers?: Headers): Promise<Response> {
    return this.request({ url, method: Method.PUT, headers, data });
  }

  async delete(url: string, headers?: Headers): Promise<Response> {
    return this.request({ url, method: Method.DELETE, headers });
  }

  async patch(url: string, data?: any, headers?: Headers): Promise<Response> {
    return this.request({ url, method: Method.PATCH, headers });
  }
}
