import { Schema, model, Document } from "mongoose";
import { EventMetadata } from "../types";

interface UniqueUserCounterInterface {
  date: Date;
  count: number;
  ref?: string;
}

const UniqueUserCounterSchema = new Schema<UniqueUserCounterInterface>({
  date: {
    type: Date,
    required: true,
    default: new Date(new Date().toISOString().slice(0, 10)),
  },
  count: { type: Number, required: true, unique: false },
  ref: { type: String },
});

type UniqueUserCounterModel = UniqueUserCounter &
  Document<UniqueUserCounterInterface>;

const UniqueUserCounterModel = model<UniqueUserCounterInterface>(
  "UniqueUser",
  UniqueUserCounterSchema
);

export default class UniqueUserCounter {
  static async incrementCount(body: EventMetadata) {
    console.log("metadata", body);
    const ref = body?.ref;
    const currentDate = new Date().toISOString().slice(0, 10);
    return UniqueUserCounterModel.updateOne(
      { date: currentDate, ref },
      { $inc: { count: 1 } },
      { upsert: true }
    );
  }
}
