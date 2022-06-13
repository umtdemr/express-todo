import { Router } from 'express';

import noteBookRouter from './notebooks';
import tasksRouter from './tasks';
import userRouter from './user';


const apiRouter = Router();


apiRouter.use('/notebooks', noteBookRouter)
apiRouter.use('/tasks', tasksRouter)
apiRouter.use('/user', userRouter)


export default apiRouter;
