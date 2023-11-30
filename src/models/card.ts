import { model, Model, Schema, Document, ObjectId } from 'mongoose';

export interface ICard {
  name: string;
  link: string;
  owner: Schema.Types.ObjectId;
  likes: ObjectId[];
  createdAt: Date
}

const cardSchema = new Schema<ICard>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  owner: {
    type:  Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  likes: {
    default: []
  },
  createdAt: {
    default: Date.now
  }
})

export default model<ICard>('card', cardSchema);