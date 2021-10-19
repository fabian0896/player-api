import express from 'express';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import setupRoutes from './routes';

import { errorLogHandler, errorHandler } from './middlewares/error.handler';

import './strategies/LocalStrategy';
import './strategies/JwtStrategy';
import './strategies/JwtRefreshStrategy';

const port = process.env.PORT || 3000;

const app = express();

app.use(cookieParser());
app.use(passport.initialize());
app.use(express.json());

setupRoutes(app);

app.use(errorLogHandler);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
