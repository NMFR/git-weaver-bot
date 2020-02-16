import Logger from './Logger';
import LogLevel from './LogLevel';

function formatError(error: Error): any {
  const json: any = {
    name: error.name,
  };

  Object.getOwnPropertyNames(error).forEach(n => {
    json[n] = (error as any)[n];
  });

  return json;
}

function stringifyReplacer(this: any, key: string, value: any): any {
  if (value instanceof Error) {
    return formatError(value);
  }

  return value;
}

function buildJsonString(level: LogLevel, messages: any[]): string {
  const json = {
    timestamp: new Date(),
    level: level.name,
    messages,
  };

  return JSON.stringify(json, stringifyReplacer);
}

export default class JsonLogger implements Logger {
  private level: LogLevel;

  constructor(level: LogLevel) {
    this.level = level;
  }

  private log(level: LogLevel, ...messages: any[]): Logger {
    if (this.level.level < level.level) {
      return this;
    }

    const str = buildJsonString(level, messages);
    // eslint-disable-next-line no-console
    console.log(str);

    return this;
  }

  error(message?: any, ...otherMessages: any[]): Logger {
    return this.log(LogLevel.error, message, ...otherMessages);
  }

  warn(message?: any, ...otherMessages: any[]): Logger {
    return this.log(LogLevel.warn, message, ...otherMessages);
  }

  info(message?: any, ...otherMessages: any[]): Logger {
    return this.log(LogLevel.info, message, ...otherMessages);
  }

  http(message?: any, ...otherMessages: any[]): Logger {
    return this.log(LogLevel.http, message, ...otherMessages);
  }

  verbose(message?: any, ...otherMessages: any[]): Logger {
    return this.log(LogLevel.verbose, message, ...otherMessages);
  }

  debug(message?: any, ...otherMessages: any[]): Logger {
    return this.log(LogLevel.debug, message, ...otherMessages);
  }
}
