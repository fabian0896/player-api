import { ObjectSchema } from 'joi';
import { Request, Response, NextFunction } from 'express';
import boom from '@hapi/boom';

type Source = 'body' | 'params' | 'query';

// eslint-disable-next-line arrow-body-style
const validatorHandler = (shcema: ObjectSchema, source: Source) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const data = req[source];
    const value = shcema.validate(data, { abortEarly: false });
    if (value.error) {
      next(boom.badRequest(value.error.message));
      return;
    }
    next();
  };
};

export default validatorHandler;
