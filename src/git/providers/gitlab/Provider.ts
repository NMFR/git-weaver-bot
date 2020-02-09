import { RequestHandler } from 'express';

import { AxiosHttpJsonClient } from '../../../common/http/json';
import GitProvider from '../Provider';
import { createWebhook } from './webhook';
import { GitlabApi } from './api';
import GitProviderConfig from '../Config';

export interface GitlabProviderConfig extends GitProviderConfig {
  apiAuthToken: string;
  webhookToken?: string;
}

export default class GitlabProvider implements GitProvider {
  readonly type: string;

  readonly name: string;

  readonly webhook?: RequestHandler;

  private api: GitlabApi;

  constructor(options: GitlabProviderConfig) {
    this.type = 'gitlab';
    this.name = options.name;

    this.api = new GitlabApi(new AxiosHttpJsonClient(), options.apiAuthToken);
    this.webhook = createWebhook({ token: options.webhookToken });
  }
}
