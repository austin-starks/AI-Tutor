import { Schema, model, Document } from "mongoose";

interface SubmitRequestCounterInterface {
  date: Date;
  count: number;
}

const SubmitRequestCounterSchema = new Schema<SubmitRequestCounterInterface>({
  date: {
    type: Date,
    required: true,
    default: new Date(new Date().toISOString().slice(0, 10)),
  },
  count: { type: Number, required: true, unique: true },
});

type SubmitRequestCounterModel = SubmitRequestCounter &
  Document<SubmitRequestCounterInterface>;

const SubmitRequestCounterModel = model<SubmitRequestCounterInterface>(
  "SubmitRequest",
  SubmitRequestCounterSchema
);

export default class SubmitRequestCounter {
  static async incrementCount() {
    const currentDate = new Date().toISOString().slice(0, 10);
    return SubmitRequestCounterModel.updateOne(
      { date: currentDate },
      { $inc: { count: 1 } },
      { upsert: true }
    );
  }
}
