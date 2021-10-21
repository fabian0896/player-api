import express, { Express } from 'express';
import authRouter from './auth.routes';
import playersRouter from './players.routes';
import qrcodeRouter from './qrcode.routes';

function setupRoutes(app: Express) {
  const router = express.Router();
  app.use('/api/v1', router);

  router.use('/auth', authRouter);
  router.use('/players', playersRouter);
  router.use('/qrcode', qrcodeRouter);
}

export default setupRoutes;
