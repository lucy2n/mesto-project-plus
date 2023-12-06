import mongoose from 'mongoose';
import express from 'express';
import helmet from 'helmet';
import { errors } from 'celebrate';
import auth from './middlewares/auth';
import { login, createUser } from './controllers/users';
import { requestLogger, errorLogger } from './middlewares/logger';
import NotFoundError from './errors/not-found-err';
import handleCentralError from './middlewares/validator';
import { createUserValidation, loginValidation } from './validation/user-validation';
import router from './routes/index';
import { PORT, DB_URL } from './config';

const app = express();

mongoose.connect(DB_URL);

app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(requestLogger);

app.post('/signup', createUserValidation, createUser);
app.post('/signin', loginValidation, login);

app.use(auth);

app.use('/', router);

app.use('*', (req, res, next) => next(new NotFoundError('Запрашиваемый ресурс не найден')));

app.use(errorLogger);

app.use(errors());

app.use(handleCentralError);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
