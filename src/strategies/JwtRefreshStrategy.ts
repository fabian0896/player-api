import {
  Strategy,
  StrategyOptions,
  VerifiedCallback,
  JwtFromRequestFunction,
} from 'passport-jwt';
import { Request } from 'express';
import boom from '@hapi/boom';
import passport from 'passport';
import config from '../config';

import AuthService from '../services/auth.service';

const cookieExtractor: JwtFromRequestFunction = (req) => req.cookies['x-refresh-token'];

const opt: StrategyOptions = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: config.jwtRefreshSecret,
  passReqToCallback: true,
};

passport.use('jwt-refresh', new Strategy(
  opt,
  async (req:Request, payload: any, done: VerifiedCallback) => {
    const { sub: id } = payload;
    const user = await AuthService.findById(Number(id));
    if (!user) {
      done(boom.unauthorized(), false);
      return;
    }
    if (user.refreshToken !== req.cookies['x-refresh-token']) {
      done(boom.unauthorized(), false);
      return;
    }
    done(null, user);
  },
));
