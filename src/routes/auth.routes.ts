import express from 'express';
import passport from 'passport';
import boom from '@hapi/boom';
import { User } from '@prisma/client';
import AuthService from '../services/auth.service';
import config from '../config';

const router = express.Router();

router.post('/login',
  passport.authenticate('local', { session: false }),
  async (req, res, next) => {
    try {
      const data = await AuthService.signTokens(req.user as User);
      res.cookie('x-refresh-token', data.refreshToken, {
        httpOnly: true,
        secure: config.env === 'production',
      });
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  });

router.post('/session',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.json(req.user);
  });

router.post('/token',
  passport.authenticate('jwt-refresh', { session: false }),
  async (req, res) => {
    const data = await AuthService.signTokens(req.user as User);
    res.cookie('x-refresh-token', data.refreshToken, {
      httpOnly: true,
      secure: config.env === 'production',
    });
    res.status(200).json(data);
  });

router.post('/logout',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    if (!req.user) {
      next(boom.unauthorized());
      return;
    }
    res.cookie('x-refresh-token', '', {
      httpOnly: true,
      secure: config.env === 'production',
    });
    const payload: any = req.user;
    await AuthService.logout(Number(payload.sub));
    res.status(200).json({
      message: 'logout successfully',
    });
  });

export default router;
