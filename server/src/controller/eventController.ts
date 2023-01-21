import SubmitRequestsCounter from "../models/event/submitRequest";
import UniqueUserCounter from "../models/event/uniqUserVisit";
import { Response, Request } from "./types";
import CallToActionCounter from "../models/event/callToAction";
import { NextFunction } from "express";

class UserController {
  countUniqueUsers = async (req: Request, res: Response) => {
    if (req.cookies.analaytics_uniqId) {
      return res.status(200).send();
    }
    // generate a random string
    const uniqId =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    res.cookie("analaytics_uniqId", uniqId);
    await UniqueUserCounter.incrementCount(req.body);
    res.status(200).send();
  };

  countUniqueCallToAction = async (req: Request, res: Response) => {
    if (req.cookies.analaytics_uniqCallToAction) {
      return res.status(200).send();
    }
    // generate a random string
    const uniqId =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    res.cookie(
      "analaytics_uniqCallToAction",
      req.cookies.analaytics_uniqId || uniqId
    );
    await CallToActionCounter.incrementCount(req.body);
    res.status(200).send();
  };

  __middleware_countUniqueSubmitRequests = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (req.cookies.analaytics_uniqSubmitRequests) {
        return next();
      }
      // generate a random string
      const uniqId =
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
      res.cookie(
        "analaytics_uniqSubmitRequests",
        req.cookies.analaytics_uniqId || uniqId
      );
      await SubmitRequestsCounter.incrementCount();
      next();
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Internal server error" });
    }
  };
}

export default new UserController();
