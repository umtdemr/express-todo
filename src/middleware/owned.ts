import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express"


const prisma = new PrismaClient();

export const noteBookOwnerMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const userId: number = req!.user!.id;
  const notebookId: number = Number(req.params.id);
  
  try {
    const notebook = await prisma.noteBook.findUnique({
      where: {
        id: notebookId
      }
    })
    if (notebook?.userId !== userId) 
    next(new Error('you are not the father'))
  } catch (error) {
    next(new Error('the notebook you provided does not exists'))
  }
  next();
}

export const taskOwnedMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const userId: number = req!.user!.id;
  const taskId: number = Number(req.params.id);
  
  try {
    const task = await prisma.task.findUnique({
      where: {
        id: taskId
      }, 
      select: {
        noteBook: true
      }
    })

    if (task?.noteBook?.userId !== userId) 
    next(new Error('you are not the father'))
  } catch (error) {
    next(new Error('the task you provided does not exists'))
  }
  
  next();
}
