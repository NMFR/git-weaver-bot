import path from 'path';
import fs from 'fs';

import { createConfig } from './config';
import Application from './Application';

async function main() {
  try {
    const configFileStream = fs.createReadStream(path.join(__dirname, '../../application.config.json'));
    const config = await createConfig(configFileStream);
    const application = new Application(config);

    return application;
  } catch (ex) {
    console.error(ex);
    return null;
  }
}

main();
