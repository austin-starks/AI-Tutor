import User from "../user";
import ReferralModel from "./schema";

class Referral {
  private static generateUniqueCode = async (): Promise<string> => {
    // Generate a random 6 alphabet character code
    let code = Math.random().toString(36).substring(2, 8).toUpperCase() + "-";
    // generate 4 random numbers and append to the code
    for (let i = 0; i < 4; i++) {
      code += Math.floor(Math.random() * 10);
    }
    let dbChecks = 0;
    while ((await ReferralModel.findOne({ code: code })) && dbChecks < 10) {
      code = await this.generateUniqueCode();
      dbChecks++;
      console.error("Duplicate referral code generated: " + code);
    }
    if (dbChecks >= 10) {
      throw new Error("Failed to generate unique referral code");
    }
    return code;
  };

  private static generateCode = async (user: User) => {
    const code = await this.generateUniqueCode();
    return ReferralModel.create({ user: user.id, code });
  };

  static getCode = async (user: User): Promise<string> => {
    let model = await ReferralModel.findOne({ user: user.id });
    if (!model) {
      model = await Referral.generateCode(user);
    }
    return model.code;
  };

  static checkCode = async (code: string): Promise<boolean> => {
    const model = await ReferralModel.findOne({ code });
    return !!model;
  };

  private static applyReward = async (referrer: User, referree: User) => {
    console.log(
      "applying reward to referrer: ",
      referrer.email,
      " and referree: ",
      referree.email
    );
    referrer.referredUsers.push(referree.id);
    referrer.balance += 100;
    await referrer.save();
    referree.balance += 100;
    await referree.save();
    console.log("reward applied successfully");
  };

  static addReferral = async (user: User, code: string) => {
    // get the user who referred the new user
    console.log("adding referral for user: ", user.email, " with code: ", code);
    const referrer = await ReferralModel.findOne({ code }).populate("user");
    if (!referrer) {
      throw new Error("Invalid referral code");
    }
    // apply reward to the referrer
    await this.applyReward(referrer.user, user);
  };
}

export default Referral;
