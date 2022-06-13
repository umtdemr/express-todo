import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import passport from 'passport';
import { taskOwnedMiddleware } from '../../../middleware/owned';  
import { body, validationResult } from 'express-validator';
import { IRequestWithUser } from '../../../types/ExtendedExpressTypes';


const tasksRouter = Router();
const prisma = new PrismaClient();


tasksRouter.use(passport.authenticate('jwt', { session: false }))


tasksRouter.route('/')
  .get(async (req: IRequestWithUser, res) => {
    const { notebook } = req.query;
    const tasks = await prisma.task.findMany({
      where: {
        noteBookId: Number(notebook) || undefined,
        noteBook: {
          userId: req!.user!.id
        }
      },
      orderBy: [
        {
          isDone: 'asc'
        },
        {
          updatedAt: 'desc'
        }
      ]
    });
    res.json(tasks);
  })
  .post(
    body('noteBookId')
      .isInt()
      .toInt()
      .withMessage('noteBookId is must be int value'),
    body('title')
      .isLength({ min: 2 })
      .withMessage('title must at leats 2 chars long'),
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() })
      }
      try {
        const { noteBookId, title } = req.body;
        const task = await prisma.task.create({
          data: {
            title,
            noteBook: { connect: { id: Number(noteBookId) } }
          }
        })
        return res.status(201).json(task);
      } catch (err) {
        return res.status(400).json({ error: err });
      }
  })

tasksRouter.route('/:id')
  .delete(taskOwnedMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      const task = await prisma.task.delete({
        where: {
          id: Number(id)
        }
      });
      res.json(task)
    }
    catch(err) {
      res.json(err);
    }
  })
  .put(
    taskOwnedMiddleware, 
    body('noteBookId')
      .isInt()
      .toInt()
      .withMessage('noteBookId is must be int value'),
    body('title')
      .isLength({ min: 2 })
      .withMessage('title must at leats 2 chars long'),
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() })
      }
      try {
        const { id } = req.params;
        const { title, noteBookId, isDone } = req.body;
        
        const task = await prisma.task.update({
          where: {
            id: Number(id)
          },
          data: {
            title,
            noteBookId: Number(noteBookId) || undefined,
            isDone: isDone === 'true' ? true : false
          }
        })
        res.json(task)
      } catch (err) {
        return res.status(400).json({ 
          message: 'You have given wrong id'
        })
      }
    }
  )

export default tasksRouter;
