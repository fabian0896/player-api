import express from 'express';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import setupRoutes from './routes';

import { errorLogHandler, errorHandler } from './middlewares/error.handler';

import './strategies/LocalStrategy';
import './strategies/JwtStrategy';
import './strategies/JwtRefreshStrategy';

const port = process.env.PORT || 4000;

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(cookieParser());
app.use(passport.initialize());
app.use(express.json());

app.get('/', (_req, res) => {
  res.send('Api working!');
});

setupRoutes(app);

app.use(errorLogHandler);
app.use(errorHandler);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on port ${port}`);
});
