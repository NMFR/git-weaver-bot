import { Request, Response, NextFunction, RequestHandler, ErrorRequestHandler } from 'express';

function isErrorRequestHandler(handler: RequestHandler | ErrorRequestHandler): handler is ErrorRequestHandler {
  return handler.length > 3;
}

// http://expressjs.com/en/advanced/best-practice-performance.html#use-promises
export const asyncWrapRequestHandler = (fn: RequestHandler) => (req: Request, res: Response, next: NextFunction) =>
  fn(req, res, next).catch(next);

export const asyncWrapErrorRequestHandler = (fn: ErrorRequestHandler) => (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => fn(err, req, res, next).catch(next);

export const asyncWrap = (fn: RequestHandler | ErrorRequestHandler) =>
  isErrorRequestHandler(fn) ? asyncWrapErrorRequestHandler(fn) : asyncWrapRequestHandler(fn);

export default asyncWrap;
