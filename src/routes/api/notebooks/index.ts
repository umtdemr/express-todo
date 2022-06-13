import { Router } from 'express';
import { PrismaClient, User } from '@prisma/client';
import passport from 'passport';
import { noteBookOwnerMiddleware } from '../../../middleware/owned';
import { body, check, validationResult } from 'express-validator';

const prisma = new PrismaClient();

const noteBookRouter = Router();

noteBookRouter.use(passport.authenticate('jwt', { session: false }))


noteBookRouter.route('/')
  .get(async (req, res) => {
    const notebooks = await prisma.noteBook.findMany({
      where: {
        userId: req!.user!.id
      }
    });
    res.json(notebooks);
  })
  .post(
    body('title')
      .isLength({ min: 2 })
      .withMessage('title must be at least 2 chars long'),
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }
      const { title } = req.body;
      const noteBook = await prisma.noteBook.create({
        data: {
          title,
          user: {
            connect: {
              id: req!.user!.id
            }
          }
        }
      })
      return res.status(201).json(noteBook)
    }
  )

noteBookRouter.route('/:id')
  .delete(
    noteBookOwnerMiddleware, 
    async (req, res) => {
      try {
        const { id } = req.params;
        const noteBook = await prisma.noteBook.delete({ 
          where: { id: Number(id) }
        })
        res.json(noteBook);
      } catch(err) {
        res.status(400).json({ message: 'can\'t delete. id is missing' })
      }
    }
  )
  .put(
    noteBookOwnerMiddleware, 
    body('title')
      .isLength({ min: 2 })
      .withMessage('title must be at least 2 chars long'),
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() })
      }

      const { id } = req.params;
      const { title } = req.body;
      const noteBook = await prisma.noteBook.update({
        where: {
          id: Number(id)
        },
        data: {
          title
        }
      })
      return res.json(noteBook)
  })


export default noteBookRouter;
