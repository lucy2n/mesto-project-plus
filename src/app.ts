import mongoose from 'mongoose';
import express, { Response, NextFunction } from 'express';
import helmet from 'helmet';
import userRouter from './routes/users';
import cardRouter from './routes/cards';
import { IUserRequest } from './types';
import { NOT_FOUND } from './utils/constants';

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;
const app = express();

mongoose.connect(DB_URL);

app.use((req: IUserRequest, res: Response, next: NextFunction) => {
  req.user = {
    _id: '5d8b8592978f8bd833ca8133',
  };

  next();
});

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.use('*', (req, res) => {
  res.status(NOT_FOUND).send({ message: 'Запрашиваемый ресурс не найден' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
