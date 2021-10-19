import express, { Express } from 'express';
import authRouter from './auth.routes';

function setupRoutes(app: Express) {
  const router = express.Router();
  app.use('/api/v1', router);

  router.use('/auth', authRouter);
}

export default setupRoutes;
