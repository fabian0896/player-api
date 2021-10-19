import { ErrorRequestHandler } from 'express';
import { Boom } from '@hapi/boom';

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
  res.status(500).json({
    message: error.message,
    stack: error.stack,
  });
};
