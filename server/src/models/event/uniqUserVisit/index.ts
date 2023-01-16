import { Schema, model, Document } from "mongoose";

interface UniqueUserCounterInterface {
  date: Date;
  count: number;
}

const UniqueUserCounterSchema = new Schema<UniqueUserCounterInterface>({
  date: {
    type: Date,
    required: true,
    default: new Date(new Date().toISOString().slice(0, 10)),
  },
  count: { type: Number, required: true, unique: true },
});

type UniqueUserCounterModel = UniqueUserCounter &
  Document<UniqueUserCounterInterface>;

const UniqueUserCounterModel = model<UniqueUserCounterInterface>(
  "UniqueUser",
  UniqueUserCounterSchema
);

export default class UniqueUserCounter {
  static async incrementCount() {
    const currentDate = new Date().toISOString().slice(0, 10);
    return UniqueUserCounterModel.updateOne(
      { date: currentDate },
      { $inc: { count: 1 } },
      { upsert: true }
    );
  }
}
