import { Schema, model, Document } from "mongoose";
import User from "../user";
import { QuestionRequest } from "./types";

interface QuestionHistory {
  _id: string;
  questionRequest: QuestionRequest;
  question: string;
  answer: string;
  user: User;
  cost: number;
  feedback?: string;
}

const questionSchema = new Schema<QuestionHistory>({
  questionRequest: { type: Object, required: true },
  question: { type: String, required: true },
  answer: { type: String },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  cost: { type: Number, required: true },
  feedback: { type: String },
  createdAt: { type: Date, default: Date.now },
});

type QuestionModel = QuestionHistory & Document<any, any, QuestionHistory>;

const QuestionModel = model<QuestionModel>("Question", questionSchema);

export default QuestionModel;
