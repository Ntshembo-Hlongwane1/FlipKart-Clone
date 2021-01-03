import { Schema, Model, Document, model } from 'mongoose';

const userSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isSeller: { type: Boolean, default: false }
});

export const userModel: Model<Document> = model('userModel', userSchema);
