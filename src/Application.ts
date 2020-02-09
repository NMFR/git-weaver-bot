import { Express, Router } from 'express';
import createServer from './api/rest';
import GitProvider from './git/providers/Provider';

interface GitProviderMap {
  [name: string]: GitProvider;
}

export default class Application {
  private static createProviders(): GitProviderMap {
    return {};
  }

  providersMap: GitProviderMap;

  restServer: Express;

  constructor() {
    this.providersMap = Application.createProviders();

    const webhooks = Router();
    Object.entries(this.providersMap).forEach(([name, provider]) => {
      if (provider.webhook) {
        webhooks.use(`/${name}`, provider.webhook);
      }
    });

    this.restServer = createServer({ webhooks });
  }
}
