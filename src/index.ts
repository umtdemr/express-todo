import express, { Request, Response, NextFunction } from 'express';
import helmet from 'express';
import morgan from 'morgan';
import passport from 'passport';
import localPassport from './middleware/passport';

import apiRouter from './routes/api';
import logger from './logger/logger';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

localPassport(passport)

app.use(express.json())
app.use(helmet())
app.use(morgan('dev'));
app.use(passport.initialize());

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(err.stack);
  res.status(400).json({ 
    message: 'app is crashed',
    error: err.message
  });
}


async function bootstrap() {
  app.get('/', (req, res) => {
    res.json({ message: 'started to app' })
  })

  app.use('/api', apiRouter)


  app.use(errorHandler);
  app.listen(3000, () => console.log('app is running at 3000'));
}

bootstrap()
  .catch((err) => {
    logger.error(err);
    throw err;
  })
  .finally(async () => {
    await prisma.$disconnect;
  })
