import Question from "../models/question";
import { QuestionRequest } from "../models/question/types";
import Balance from "../models/userBalance";
import { handleError } from "./common";
import { Response, Request } from "./types";

class QuestionController {
  ask = async (req: Request, res: Response) => {
    try {
      const response = await Question.ask(
        req.body as QuestionRequest,
        req.user
      );
      res.status(200).json(response);
    } catch (err) {
      console.log(err);
      handleError(err, res);
    }
  };

  submitFeedback = async (req: Request, res: Response) => {
    try {
      const { id, feedback } = req.body;
      if (!id || !feedback) {
        console.log(req.body);
        return res.status(400).json({ message: "Missing id or feedback" });
      }
      const response = await Question.submitFeedback(id, req.user.id, feedback);
      res.status(200).json(response);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  };

  getQuestionCostsAndBalance = async (req: Request, res: Response) => {
    try {
      const costs = Question.getQuestionCosts();
      const balance = await Balance.getBalance(req.user);
      res.status(200).json({ costs, balance });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  };
}

export default new QuestionController();
