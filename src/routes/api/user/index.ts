import { Router } from 'express'
import { PrismaClient, User } from '@prisma/client';
import passport from '../../../middleware/passport'
import { comparePassword, generatePassword, signJWT } from '../../../util/auth';
import { body, validationResult } from 'express-validator';


const prisma = new PrismaClient();

const userRouter = Router()


userRouter.post(
  '/signup', 
  body('email')
    .isEmail()
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('password must be at least 6 chars long'),
  body('name')
    .isLength({ min: 2 })
    .withMessage('name must be at least 2 chars long'),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() })
    }
    try {
      const { email, password, name } = req.body;
      const user: Partial<User> = await prisma.user.create({
        data: {
          email,
          password: await generatePassword(password),
          name
        },
        select: {
          email: true,
          id: true,
          name: true
        }
      })
      return res.status(201).json({ 
        user,
      })
    } catch (err) {
      next(err);
    }
})

userRouter.post(
  '/login',
  body('email')
    .isEmail()
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('password must be at least 6 chars long'),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() })
    }

    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: {email} });
    if (!user) {
      return res.status(400).json({ message: 'user cant find' })
    }

    const validate = await comparePassword(user.password, password);
    if (!validate) {
      return res.status(400).json({ message: 'wrong password' })
    }

    return res.json({ token: signJWT(user) });
  }
)


export default userRouter;
