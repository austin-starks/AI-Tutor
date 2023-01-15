import User from "../user";
import BalanceModel from "./schema";
import referralCodes, { Charset } from "referral-codes";

class Referral {
  private static generateUniqueCode = async (): Promise<string> => {
    let codes = referralCodes.generate({
      length: 8,
      count: 1,
      charset: referralCodes.charset(Charset.ALPHABETIC),
    });
    codes[0] +=
      "-" +
      referralCodes.generate({
        pattern: "####",
      })[0];
    let count = 0;
    while ((await BalanceModel.findOne({ code: codes[0] })) && count < 10) {
      codes[0] = await this.generateUniqueCode();
      count++;
      console.error("Duplicate referral code generated: " + codes[0]);
    }
    return codes[0];
  };

  private static generateCode = async (user: User) => {
    const code = await this.generateUniqueCode();
    return BalanceModel.create({ user: user.id, code });
  };

  static getCode = async (user: User): Promise<string> => {
    let model = await BalanceModel.findOne({ user: user.id });
    if (!model) {
      model = await Referral.generateCode(user);
    }
    return model.code;
  };
}

export default Referral;
