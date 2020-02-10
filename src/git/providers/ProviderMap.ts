import GitProvider from './Provider';

export default interface GitProviderMap {
  [name: string]: GitProvider;
}
