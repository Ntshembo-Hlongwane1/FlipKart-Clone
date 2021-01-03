import { Model, Document, Schema, model } from 'mongoose';

const userSessionSchema: Schema = new Schema({
  expires: { type: Date, required: true },
  session: { type: Object, required: true }
});

export const userSesionModel: Model<Document> = model('usersessions', userSessionSchema);
