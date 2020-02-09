import axios, { AxiosInstance } from 'axios';

import HttpJsonClient, { Options, Response } from './Client';

export default class AxiosHttpJsonClient extends HttpJsonClient {
  private axiosInstance: AxiosInstance;

  constructor() {
    super();
    this.axiosInstance = axios.create({
      headers: { 'Content-Type': 'application/json' },
      validateStatus: () => true,
      responseType: 'json',
    });
  }

  async request(options: Options): Promise<Response> {
    const response = await this.axiosInstance.request({
      url: options.url,
      method: options.method,
      headers: options?.headers,
      data: options?.data,
    });

    return {
      status: response.status,
      headers: response.headers,
      data: response.data,
    };
  }
}
