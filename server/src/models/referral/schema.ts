import { Schema, model, Document } from "mongoose";
import User from "../user";

interface Referral {
  user: User;
  code: string;
}

const ReferralSchema = new Schema<Referral>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  code: { type: String, required: true, unique: true },
});

type ReferralModel = Referral & Document<Referral>;

const ReferralModel = model<ReferralModel>("Referral", ReferralSchema);

export default ReferralModel;
