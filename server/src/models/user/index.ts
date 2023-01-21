import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import _ from "lodash";
import { Document, model, Schema } from "mongoose";
import validator from "validator";

const DEFAULT_BALANCE = 100;

export interface IUser {
  _id?: string;
  email: string;
  password: string;
  phoneNumber: string;
  referredUsers?: any[];
  balance?: number;
}

export class InsufficientBalanceError extends Error {}

const transformPhoneNumber = (phoneNumber: string): string => {
  // Remove all non-digit characters from the phone number
  let digits = phoneNumber.replace(/\D/g, "");

  // Check if the phone number is in international format
  const isInternational = digits.startsWith("+");

  // If the phone number is not in international format, assume it's a US number
  // and add the country code
  if (!isInternational) {
    digits = `+1${digits}`;
  }

  // Split the phone number into the country code, area code, and local number
  const match = digits.match(/^(\+\d{1,3})(\d{3})(\d{3})(\d{4})$/);

  if (!match) {
    throw new Error("Invalid phone number");
  }
  const [, countryCode, areaCode, middle, last] = match;
  return `${countryCode} (${areaCode}) ${middle}-${last}`;
};

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    index: true,
    unique: true,
    validate: (value: string) => {
      return validator.isEmail(value);
    },
  },
  password: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    index: true,
    validate: (value: string) => {
      return validator.isMobilePhone(value);
    },
  },
  referredUsers: { type: [Schema.Types.ObjectId], ref: "User", default: [] },
  balance: { type: Number, default: DEFAULT_BALANCE },
});

type UserModel = IUser & Document<IUser>;

const UserModel = model<UserModel>("User", userSchema);

export default class User implements IUser {
  /**
   * A class representing a user.
   *
   * @remarks
   * A user is someon who has created an account to use the system. They have an email,
   * paassword, and metadata associated with them.
   *
   * @privateRemarks
   * In the future, users will also have a profile associated with them that will be used to
   * recommend articles and stocks that they might like.
   */
  _id?: string;
  email: string;
  password: string;
  phoneNumber: string;
  referredUsers: string[];
  balance: number;

  async save(): Promise<void> {
    if (this._id) {
      await UserModel.updateOne({ _id: this._id }, this);
      return;
    }
    const model = await UserModel.create(this);
    this._id = model._id;
  }

  constructor(obj?: IUser) {
    if (obj) {
      this._id = obj._id;
      this.password = obj._id
        ? obj.password
        : bcrypt.hashSync(obj.password, 12);
      this.email = obj.email;
      this.phoneNumber = obj.phoneNumber;
      this.referredUsers = obj.referredUsers || [];
      this.balance = _.isNil(obj.balance) ? DEFAULT_BALANCE : obj.balance;
    }
  }

  public get id(): string {
    return this._id;
  }

  public async recordTransaction(amount: number) {
    this.balance -= amount;
    if (this.balance < 0) {
      throw new InsufficientBalanceError("Insufficient balance");
    }
    await this.save();
    return this.balance;
  }

  addBalance = async (amount: number) => {
    this.balance += amount;
    await this.save();
    return this.balance;
  };

  getBalance = () => {
    return this.balance;
  };

  public async generateAuthToken(longExpiration = false) {
    if (!this.id) {
      throw new Error("Authentication failed. User not found.");
    }
    const expiresIn = longExpiration ? "14d" : "24h";
    const token = jwt.sign({ sub: this.id }, process.env.JWT_TOKEN_SECRET, {
      expiresIn: expiresIn,
    });
    return token;
  }

  public static async login(emailOrPhone: string, password: string) {
    const isEmail = validator.isEmail(emailOrPhone);
    const isPhone = validator.isMobilePhone(emailOrPhone);
    if (!isEmail && !isPhone) {
      throw new Error("Invalid login credentials");
    }
    let user: UserModel;
    if (isPhone) {
      emailOrPhone = transformPhoneNumber(emailOrPhone);
      user = await UserModel.findOne({ phoneNumber: emailOrPhone });
    } else {
      user = await UserModel.findOne({ email: emailOrPhone });
    }
    if (!user) {
      throw new Error("Invalid login credentials");
    }
    const passwordMatched = await bcrypt.compare(password, user.password);
    if (!passwordMatched) {
      throw new Error("Invalid login credentials");
    }
    return new User(user);
  }

  public static async create(userInfo: IUser) {
    const user = new User({
      ...userInfo,
      phoneNumber: transformPhoneNumber(userInfo.phoneNumber),
    });
    await user.save();
    return user;
  }

  public static async findById(id: string): Promise<User> {
    return UserModel.findOne({ _id: id }).then((userM) => {
      if (!userM) {
        throw Error(`User with_id: ${id} does not exist.`);
      }
      return new User(userM);
    });
  }

  public static async findByEmail(email: string): Promise<User> {
    return UserModel.findOne({ email }).then((userM) => {
      if (!userM) {
        throw Error(`User with email '${email}' does not exist.`);
      }
      return new User(userM);
    });
  }

  public static async find(): Promise<User[]> {
    return UserModel.find().then((userMArr) => {
      return userMArr.map((u) => new User(u));
    });
  }
}
