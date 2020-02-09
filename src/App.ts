import { Express } from 'express';
import createServer from './api/rest';
import GitProvider from './git/providers/Provider';

export default class App {
  providers: GitProvider[];

  restServer: Express;

  constructor() {
    this.providers = [];
    this.restServer = createServer();
  }
}
