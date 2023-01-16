import { Schema, model, Document } from "mongoose";
import User from "../user";

interface UniqueUserCounterInterface {
  count: number;
}

const UniqueUserCounterSchema = new Schema<UniqueUserCounterInterface>({
  count: { type: Number, required: true, unique: true },
});

type UniqueUserCounterModel = UniqueUserCounter &
  Document<UniqueUserCounterInterface>;

const UniqueUserCounterModel = model<UniqueUserCounterInterface>(
  "UniqueUserCounter",
  UniqueUserCounterSchema
);

export default class UniqueUserCounter {
  static async incrementCount() {
    const model = await UniqueUserCounterModel.findOne();
    if (!model) {
      return UniqueUserCounterModel.create({ count: 1 });
    }
    model.count += 1;
    return model.save();
  }
}
