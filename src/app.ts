import mongoose from 'mongoose';
import express from 'express';
import userRoutes from './routes/users';
import cardRoutes from './routes/cards'
import path from 'path';

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb')

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use('/users', userRoutes);
app.use('/cards', cardRoutes)
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
});