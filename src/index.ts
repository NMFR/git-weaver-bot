import path from 'path';

import { Logger } from './logger';
import { createConfigFromFile } from './config';
import Application from './Application';
import { diContainer } from './dependencyInjection';
import JsonLogger from './logger/JsonLogger';
import LogLevel from './logger/LogLevel';

async function main() {
  try {
    let logger: Logger;
    diContainer.register('Logger', (logger = new JsonLogger(LogLevel.info)));

    const configFilePath = path.join(__dirname, '../../application.config.json');
    const config = await createConfigFromFile(configFilePath);

    diContainer.register('Logger', (logger = new JsonLogger(LogLevel.fromString(config.logLevel))));

    logger.info(`read configuration from: '${configFilePath}'`);
    logger.info(`log level: '${config.logLevel}'`);

    diContainer.register('Application', new Application(config));
  } catch (ex) {
    diContainer.resolve('Logger').error('error', { error: ex });
  }
}

main();
