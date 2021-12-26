import { model, Schema } from "mongoose";

const questionSchema = new Schema({
  asker: { type: String, unique: false },
  responder: { type: String, unique: false },
  question: { type: String, unique: false },
  answer: { type: String, sparse: true },
});

export const questionModel = model("Question", questionSchema);
