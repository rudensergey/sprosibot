import { ObjectId } from "mongodb";
import { model, Schema } from "mongoose";

export interface IQuestion {
  _id: ObjectId;
  asker: string;
  responder: string;
  question: string;
  __v: number;
}

export const questionSchema = new Schema({
  asker: { type: String, unique: false },
  responder: { type: String, unique: false },
  question: { type: String, unique: false },
  answer: { type: String, sparse: true },
});

export const questionModel = model("Question", questionSchema);
