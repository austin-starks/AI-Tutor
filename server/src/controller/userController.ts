import User from "../models/user";
import Balance from "../models/userBalance";
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
      const balance = await Balance.getBalance(user);
      res.status(200).json({ message: "Authentication succeeded", balance });
    } catch (err) {
      res.status(400).json({ message: "Invalid email and/or password" });
    }
  };

  register = async (req: RegistrationRequest, res: Response) => {
    let user: User;
    try {
      const userInfo = req.body;
      user = await User.create(userInfo);
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
      const balance = await Balance.getBalance(user);
      res.status(201).json({ message: "User created successfully", balance });
    } catch (e) {
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

  async getBalance(req: Request, res: Response) {
    try {
      const balance = await Balance.getBalance(req.user);
      console.log("balance", balance);
      res.status(200).json({ balance });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  }
}

export default new UserController();
