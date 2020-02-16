export default interface Logger {
  error(message: any, ...otherMessages: any[]): Logger;
  warn(message: any, ...otherMessages: any[]): Logger;
  info(message: any, ...otherMessages: any[]): Logger;
  http(message: any, ...otherMessages: any[]): Logger;
  verbose(message: any, ...otherMessages: any[]): Logger;
  debug(message: any, ...otherMessages: any[]): Logger;
}
