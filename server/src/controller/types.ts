import {
  Request as _Request,
  Response as _Response,
  NextFunction as _NextFunction,
} from "express";
import User from "../models/user";

export interface Request extends _Request {
  user: User;
}
export interface Response extends _Response {}
export interface NextFunction extends _NextFunction {}

export interface RegistrationRequest extends Request {
  body: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password: string;
    confirmPassword?: string;
    remember?: boolean;
    referralCode?: string;
  };
}
export interface LoginRequest extends Request {
  body: {
    emailOrPhone: string;
    password: string;
    remember?: boolean;
  };
}
