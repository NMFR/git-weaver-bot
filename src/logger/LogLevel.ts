export default class LogLevel {
  static readonly error: LogLevel = new LogLevel('error', 0);

  static readonly warn: LogLevel = new LogLevel('warn', 1);

  static readonly info: LogLevel = new LogLevel('info', 2);

  static readonly http: LogLevel = new LogLevel('http', 3);

  static readonly verbose: LogLevel = new LogLevel('verbose', 4);

  static readonly debug: LogLevel = new LogLevel('debug', 5);

  static fromString(str: string): LogLevel {
    const cleanedStr = (str || '').trim().toLowerCase();

    const logger = (LogLevel as any)[cleanedStr];

    if (logger instanceof LogLevel) {
      return logger;
    }

    return null;
  }

  readonly level: number;

  readonly name: string;

  private constructor(name: string, level: number) {
    this.name = name;
    this.level = level;
  }

  toString() {
    return this.name;
  }
}
