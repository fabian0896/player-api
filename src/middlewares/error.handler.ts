import { ErrorRequestHandler } from 'express';
import { Boom, boomify } from '@hapi/boom';

export const errorLogHandler: ErrorRequestHandler = (error, _req, _res, next) => {
  console.error(error);
  next(error);
};

// eslint-disable-next-line no-unused-vars
export const errorHandler: ErrorRequestHandler = (error: Boom, _req, res, _next) => {
  if (error.isBoom) {
    const { output } = error;
    res.status(output.statusCode).json(output.payload);
    return;
  }
  const boomError = boomify(error);
  res.status(boomError.output.statusCode).json(boomError.output.payload);
};
