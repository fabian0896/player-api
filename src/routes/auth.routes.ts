import express from 'express';
import passport from 'passport';
import boom from '@hapi/boom';
import { User } from '@prisma/client';
import AuthService from '../services/auth.service';
import config from '../config';
import { inviteUserSchema, signupSchema } from '../schemas/user.schema';
import validatorHandler from '../middlewares/validate.handler';
import validateRole from '../middlewares/validateRole.handler';

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

router.post('/logout',
  passport.authenticate('jwt-refresh', { session: false }),
  async (req, res, next) => {
    if (!req.user) {
      next(boom.unauthorized());
      return;
    }
    res.cookie('x-refresh-token', '', {
      httpOnly: true,
      secure: config.env === 'production',
    });
    const payload = req.user as User;
    await AuthService.logout(Number(payload.id));
    res.status(200).json({
      message: 'logout successfully',
    });
  });

router.post('/invite',
  passport.authenticate('jwt', { session: false }),
  validateRole(['admin']),
  validatorHandler(inviteUserSchema, 'body'),
  async (req, res, next) => {
    const { email, role } = req.body;
    try {
      const inviteToken = await AuthService.createInviteToken(email, role);
      // TODO
      // enviar email de invitación con el token como query param
      res.json({ inviteToken });
    } catch (error) {
      next(error);
    }
  });

router.post('/signup',
  validatorHandler(signupSchema, 'body'),
  async (req, res, next) => {
    const {
      email,
      name,
      password,
      inviteToken,
    } = req.body;

    try {
      const payload = await AuthService.signup(email, password, name, inviteToken);
      res.status(200).json(payload);
    } catch (error) {
      next(error);
    }
  });

export default router;
