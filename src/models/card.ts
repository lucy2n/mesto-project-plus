import { model, Schema } from 'mongoose';
import validator from 'validator';

export interface ICard {
  name: string;
  link: string;
  owner: Schema.Types.ObjectId,
  likes: Schema.Types.ObjectId[];
  createdAt: Date
}

const cardSchema = new Schema<ICard>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (v: string) => validator.isURL(v),
      message: 'Неправильный формат URL',
    },
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: {
    type: [{ type: Schema.Types.ObjectId, ref: 'user' }],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default model<ICard>('card', cardSchema);
