import { Schema } from "mongoose";

export const questionSchema = new Schema({
  asker: { type: String },
  responder: { type: String },
  question: { type: String },
  answer: { type: String || null },
});
