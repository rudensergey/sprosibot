import { Schema } from "mongoose";
import { userSchema } from "./user";

export const questionSchema = new Schema({
  asker: { type: String },
  responder: { type: String },
  question: { type: String },
  answer: { type: String || null },
});
