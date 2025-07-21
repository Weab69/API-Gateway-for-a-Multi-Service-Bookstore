import { Strategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import { PassportStatic } from 'passport';
import { MongoUserRepository } from '../repositories/userRepository';

const userRepository = new MongoUserRepository();

const opts: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET!,
};

export const configureJwtStrategy = (passport: PassportStatic) => {
  passport.use(
    new Strategy(opts, async (jwt_payload, done) => {
      try {
        const user = await userRepository.findByEmail(jwt_payload.email);
        if (user) {
          return done(null, user);
        }
        return done(null, false);
      } catch (error) {
        return done(error, false);
      }
    })
  );
};