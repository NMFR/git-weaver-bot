import { RequestHandler } from 'express';

import packageJson from '../../../../package.json';

const version: RequestHandler = (request, response) => response.status(200).send({ version: packageJson.version });

export default version;
