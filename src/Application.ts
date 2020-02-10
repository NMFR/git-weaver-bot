import { Express, Router } from 'express';

import createServer from './api/rest';
import GitProviderMap from './git/providers/ProviderMap';
import Config, { ProviderMapConfig } from './config';

const VALID_PROVIDER_NAME_REGEX = /^[a-zA-Z-]+$/g;
const VALID_PROVIDER_TYPE_REGEX = /^[a-zA-Z-]+$/g;

export default class Application {
  private static createProviders(config: ProviderMapConfig): GitProviderMap {
    const map: GitProviderMap = {};

    Object.entries(config).forEach(([name, providerConfig]) => {
      if (!name || !name.match(VALID_PROVIDER_NAME_REGEX)) {
        throw new Error(`invalid git provider configuration, invalid provider name "${name}"`);
      }

      if (map[name]) {
        throw new Error(`invalid git provider configuration, repeated entries with the name "${name}"`);
      }

      const { type } = providerConfig;

      if (!type || !type.match(VALID_PROVIDER_TYPE_REGEX)) {
        throw new Error(
          `invalid git provider configuration, invalid provider type "${type}" on provider with name "${name}"`,
        );
      }

      // eslint-disable-next-line import/no-dynamic-require, global-require, @typescript-eslint/no-var-requires
      const Provider = require(`./git/providers/${type}`).default;

      const providerConfigClone = { ...providerConfig };
      delete providerConfigClone.type;
      providerConfigClone.name = name;

      const provider = new Provider(providerConfigClone);

      map[name] = provider;

      console.info(`created git provider "${name}" of type "${type}"`);
    });

    return map;
  }

  providersMap: GitProviderMap;

  restServer: Express;

  constructor(config: Config) {
    this.providersMap = Application.createProviders(config.providerMap);

    const webhooks = Router();
    Object.entries(this.providersMap).forEach(([name, provider]) => {
      if (provider.webhook) {
        console.info(`setting up webhook for "${name}" provider`);
        webhooks.use(`/${name}`, provider.webhook);
      }
    });

    this.restServer = createServer({ hostname: config.hostname, port: config.port, webhooks });
  }
}
