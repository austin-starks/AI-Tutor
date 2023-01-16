import { Schema, model, Document } from "mongoose";

interface CallToAction {
  date: Date;
  count: number;
  buttonId: number;
}

const CallToActionCounterSchema = new Schema<CallToAction>({
  date: {
    type: Date,
    required: true,
    default: new Date(new Date().toISOString().slice(0, 10)),
  },
  count: { type: Number, required: true, unique: true },
  buttonId: { type: Number, required: true },
});

type CallToActionCounterModel = CallToAction & Document<CallToAction>;

const CallToActionCounterModel = model<CallToAction>(
  "CallToAction",
  CallToActionCounterSchema
);

export default class CallToActionCounter {
  static async incrementCount(buttonId: number) {
    const currentDate = new Date().toISOString().slice(0, 10);
    return CallToActionCounterModel.updateOne(
      { date: currentDate, buttonId },
      { $inc: { count: 1 } },
      { upsert: true }
    );
  }
}
