import { Schema, model, Document } from "mongoose";
import { EventMetadata } from "../types";

interface CallToAction {
  date: Date;
  count: number;
  buttonId: number;
  ref?: string;
}

const CallToActionCounterSchema = new Schema<CallToAction>({
  date: {
    type: Date,
    required: true,
    default: new Date(new Date().toISOString().slice(0, 10)),
  },
  count: { type: Number, required: true, unique: false },
  buttonId: { type: Number, required: true },
  ref: { type: String },
});

type CallToActionCounterModel = CallToAction & Document<CallToAction>;

const CallToActionCounterModel = model<CallToAction>(
  "CallToAction",
  CallToActionCounterSchema
);

export default class CallToActionCounter {
  static async incrementCount(metadata: EventMetadata) {
    const buttonId = metadata?.id;
    const ref = metadata?.ref;
    const currentDate = new Date().toISOString().slice(0, 10);
    return CallToActionCounterModel.updateOne(
      { date: currentDate, buttonId, ref },
      { $inc: { count: 1 } },
      { upsert: true }
    );
  }
}
