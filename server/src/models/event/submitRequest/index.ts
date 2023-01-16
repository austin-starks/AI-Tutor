import { Schema, model, Document } from "mongoose";
import { EventMetadata } from "../types";

interface SubmitRequestCounterInterface {
  date: Date;
  count: number;
  ref?: string;
}

const SubmitRequestCounterSchema = new Schema<SubmitRequestCounterInterface>({
  date: {
    type: Date,
    required: true,
    default: new Date(new Date().toISOString().slice(0, 10)),
  },
  ref: { type: String },
  count: { type: Number, required: true, unique: true },
});

type SubmitRequestCounterModel = SubmitRequestCounter &
  Document<SubmitRequestCounterInterface>;

const SubmitRequestCounterModel = model<SubmitRequestCounterInterface>(
  "SubmitRequest",
  SubmitRequestCounterSchema
);

export default class SubmitRequestCounter {
  static async incrementCount(body?: EventMetadata) {
    const ref = body?.ref;
    const currentDate = new Date().toISOString().slice(0, 10);
    return SubmitRequestCounterModel.updateOne(
      { date: currentDate, ref },
      { $inc: { count: 1 } },
      { upsert: true }
    );
  }
}
