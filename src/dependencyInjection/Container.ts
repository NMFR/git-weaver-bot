interface SingletonMap {
  [name: string]: any;
}

interface FactoryMap {
  [name: string]: (...params: any) => any;
}

export default class DIContainer {
  private singletonMap: SingletonMap = {};

  private factoryMap: FactoryMap = {};

  registerSingleton(key: string, singleton: any) {
    this.singletonMap[key] = singleton;
  }

  registerFactory(key: string, factory: (...params: any) => any) {
    this.factoryMap[key] = factory;
  }

  register(key: string, entry: any) {
    if (typeof entry === 'function') {
      this.registerFactory(key, entry);
    }

    this.registerSingleton(key, entry);
  }

  resolve(key: string): any {
    if (this.singletonMap[key]) {
      return this.singletonMap[key];
    }

    if (this.factoryMap[key]) {
      return this.factoryMap[key]();
    }

    return null;
  }
}
