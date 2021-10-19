import express, { Express } from 'express';
import authRouter from './auth.routes';
import playersRouter from './players.routes';

function setupRoutes(app: Express) {
  const router = express.Router();
  app.use('/api/v1', router);

  router.use('/auth', authRouter);
  router.use('/players', playersRouter);
}

export default setupRoutes;
