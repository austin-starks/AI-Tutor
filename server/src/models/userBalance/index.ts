import User from "../user";
import BalanceModel from "./schema";

export class InsufficientBalanceError extends Error {}

class Balance {
  static newBalance = async (user: User) => {
    return BalanceModel.create({ user: user.id, balance: 10 });
  };

  static addBalance = async (user: User, amount: number) => {
    let model = await BalanceModel.findOne({ user: user.id });
    if (!model) {
      model = await Balance.newBalance(user);
    }
    model.balance += amount;
    await model.save();
    return model.balance;
  };

  static async recordTransaction(user: User, amount: number) {
    let model = await BalanceModel.findOne({ user: user.id });
    if (!model) {
      model = await Balance.newBalance(user);
    }
    model.balance -= amount;
    if (model.balance < 0) {
      throw new InsufficientBalanceError("Insufficient balance");
    }
    await model.save();
    return model.balance;
  }

  static getBalance = async (user: User) => {
    const model = await BalanceModel.findOne({ user: user.id });
    if (!model) {
      return;
    }
    return model.balance;
  };
}

export default Balance;
