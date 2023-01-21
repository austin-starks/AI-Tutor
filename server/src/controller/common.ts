import { Response } from "express";
import { InsufficientBalanceError } from "../models/user";

export const handleError = (err: Error, res: Response): void => {
  console.log(err);
  if (err instanceof InsufficientBalanceError) {
    res.status(402).json({ msg: err.message, success: false });
    return;
  }
  res.status(500).json({ msg: err.message, success: false });
};
