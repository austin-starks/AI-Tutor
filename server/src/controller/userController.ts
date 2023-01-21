import _ from "lodash";
import Referral from "../models/referral";
import User from "../models/user";
import { LoginRequest, RegistrationRequest, Response, Request } from "./types";

class UserController {
  handleRegistrationErrors = (error: any): [number, string] => {
    const isMongoError =
      error.name === "MongoError" || error.name === "MongoServerError";
    if (isMongoError && error.keyValue.email) {
      return [400, "Email already exists"];
    } else if (error.name === "MongoError") {
      return [400, "Username already exists"];
    } else if (error.name === "ValidatorError") {
      return [400, "Invalid Username"];
    } else if (isMongoError && error.keyValue.phoneNumber) {
      return [400, "Phone number already registered"];
    } else if (error.errors.phoneNumber) {
      return [400, "Invalid phone number"];
    } else {
      return [400, "Undefined error"];
    }
  };

  login = async (req: LoginRequest, res: Response) => {
    try {
      const { emailOrPhone, password, remember } = req.body;
      const user = await User.login(emailOrPhone, password);
      if (!user)
        return res
          .status(401)
          .json({ message: "Invalid email and/or password" });
      const token = await user.generateAuthToken(remember);
      let cookieMaxAge = 1 * 24 * 60 * 60 * 1000;
      cookieMaxAge = remember ? cookieMaxAge * 14 : cookieMaxAge;
      res.cookie("jwt", token, {
        maxAge: cookieMaxAge,
        secure: process.env.NODE_ENV !== "development",
      });
      res.cookie("email", user.email, {
        maxAge: cookieMaxAge,
        secure: process.env.NODE_ENV !== "development",
      });
      const balance = user.balance;
      res.status(200).json({ message: "Authentication succeeded", balance });
    } catch (err) {
      res.status(400).json({ message: "Invalid email and/or password" });
    }
  };

  register = async (req: RegistrationRequest, res: Response) => {
    let user: User;
    try {
      const userInfo = req.body;
      if (userInfo.referralCode) {
        console.log("Referral code: ", userInfo.referralCode);
        const validCode = await Referral.checkCode(userInfo.referralCode);
        console.log("Valid code: ", validCode);
        if (!validCode) {
          return res.status(400).json({ message: "Invalid referral code" });
        }
      }
      console.log("Creating user");
      user = await User.create(userInfo);
      if (userInfo.referralCode) {
        console.log("Adding referral");
        await Referral.addReferral(user, userInfo.referralCode);
      }
      console.log("Auth token");
      const token = await user.generateAuthToken(userInfo.remember);
      let cookieMaxAge = 1 * 24 * 60 * 60 * 1000;
      cookieMaxAge = userInfo.remember ? cookieMaxAge * 14 : cookieMaxAge;
      res.cookie("jwt", token, {
        maxAge: cookieMaxAge,
        secure: process.env.NODE_ENV !== "development",
      });
      res.cookie("email", user.email, {
        maxAge: cookieMaxAge,
        secure: process.env.NODE_ENV !== "development",
      });
      const balance = user.balance;
      await Referral.getCode(user);
      res.status(201).json({ message: "Authentication succeeded", balance });
    } catch (e) {
      console.log(e);
      const [statusCode, errMsg] = this.handleRegistrationErrors(e);
      res.status(statusCode).json({ message: errMsg });
    }
  };

  logout = async (_req: Request, res: Response) => {
    try {
      res.clearCookie("jwt");
      res.clearCookie("email");
      res.status(200).json({ message: "User successfully logged out" });
    } catch (error) {
      res.status(500).json({ message: error.msg });
    }
  };

  getBalance = async (req: Request, res: Response) => {
    try {
      res.status(200).json({ balance: req.user.balance });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  };

  getReferralCode = async (req: Request, res: Response) => {
    try {
      const referralCode = await Referral.getCode(req.user);
      res.status(200).json({ referralCode });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  };
}

export default new UserController();
