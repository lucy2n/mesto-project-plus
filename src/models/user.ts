import mongoose, { Model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import validator from 'validator';
import UnauthorizedError from '../errors/unauthorized-err';
import { defaultValue } from '../config';

export interface IUser {
  name: string;
  about: string;
  avatar: string;
  email: string;
  password: string;
}
interface UserModel extends Model<IUser> {
  findUserByCredentials:
  // eslint-disable-next-line no-unused-vars
  (email: string, password: string) => Promise<Document<unknown, any, IUser>>
}

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: defaultValue.name,
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: defaultValue.about,
  },
  avatar: {
    type: String,
    default: defaultValue.avatar,
    validate: {
      validator: (v: string) => validator.isURL(v),
      message: 'Неправильный формат URL',
    },
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: (v: string) => validator.isEmail(v),
      message: 'Неправильный формат почты',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.static('findUserByCredentials', function findUserByCredentials(email: string, password: string) {
  return this.findOne({ email }).select('+password')
    .then((user: any) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
          }
          return user;
        });
    });
});

export default mongoose.model<IUser, UserModel>('user', userSchema);
