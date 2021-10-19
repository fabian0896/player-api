import passport from 'passport';
import boom from '@hapi/boom';
import bcrypt from 'bcrypt';
import { Strategy as LocalStrategy } from 'passport-local';
import AuthService from '../services/auth.service';

passport.use(new LocalStrategy(
  { usernameField: 'email' },
  async (email, password, done) => {
    const user = await AuthService.findByEmail(email);
    if (!user) {
      done(boom.unauthorized(), false);
      return;
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      done(boom.unauthorized(), false);
      return;
    }
    done(null, user);
  },
));
