import passport from 'passport';
import boom from '@hapi/boom';
import bcrypt from 'bcrypt';
import { Strategy as LocalStrategy } from 'passport-local';
import AuthService from '../services/auth.service';

passport.use(new LocalStrategy(
  async (username, password, done) => {
    const user = await AuthService.findByEmail(username);
    if (!user) {
      done(boom.unauthorized(), false);
      return;
    }
    const isSamePass = await bcrypt.compare(password, user.password);
    if (!isSamePass) {
      done(boom.unauthorized(), false);
      return;
    }
    done(null, user);
  },
));
