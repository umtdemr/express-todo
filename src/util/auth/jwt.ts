import { User } from '@prisma/client'
import jwt from 'jsonwebtoken'

// TODO: this will be given from env
export const JWT_SECRET = 'TOP_LEVEL_SECRET_OF_JWT'


export const signJWT = (user: Partial<User>) => {
  const token = jwt.sign(
    {
      email: user.email,
      id: user.id
    },
    JWT_SECRET,
    {
      expiresIn: '1hr'
    }
  )
  return token;
}


export const verifyJWT = (token: string) => {
  // throws a JsonWebTokenError error if invalid
  const verify = jwt.verify(token, JWT_SECRET);
  return verify;
}
