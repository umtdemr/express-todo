import { PrismaClient } from '@prisma/client';
import { JwtPayload } from 'jsonwebtoken';
import passport from 'passport';
import { Strategy as JWTStrategy, VerifiedCallback, ExtractJwt } from 'passport-jwt';

import { JWT_SECRET } from '../util/auth/jwt';

const prisma = new PrismaClient();

export default (passport: passport.PassportStatic) => {
  passport.use(
    'jwt',
    new JWTStrategy(
      {
        secretOrKey: JWT_SECRET,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
      },
      async (jwtPaylaod: JwtPayload, done: VerifiedCallback) => {
        const user = await prisma.user.findUnique({
          where: { email: jwtPaylaod.email},
          select: {
            name: true,
            email: true,
            id: true
          }
        })
        try {
          return done(null, user);
        } catch (err) {
          done(err);
        }
      }
    )
  )
}

