import express from "express";
import eventController from "../controller/eventController";
import questionController from "../controller/questionController";
import auth from "../middleware/auth";

const router = express.Router();

router.post(
  "/",
  eventController.__middleware_countUniqueSubmitRequests,
  auth.isAuthorized,
  questionController.ask
);
router.post("/feedback", auth.isAuthorized, questionController.submitFeedback);
router.get("/costs", questionController.getQuestionCosts);

export default router;
