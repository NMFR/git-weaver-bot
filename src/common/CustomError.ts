export default class CustomError extends Error {
  name: string;

  inner: Error | null;

  constructor(message: string, inner: Error | null = null) {
    super(message);
    this.name = this.constructor.name;
    this.inner = inner;
    Error.captureStackTrace(this, this.constructor);
  }
}
