import { Schema, model, Document } from "mongoose";
import User from "../user";

interface Balance {
  user: User;
  balance: number;
}

const balanceSchema = new Schema<Balance>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  balance: { type: Number, required: true },
});

type BalanceModel = Balance & Document<Balance>;

const BalanceModel = model<BalanceModel>("Balance", balanceSchema);

export default BalanceModel;
