import express from "express";
import questionController from "../controller/questionController";
import auth from "../middleware/auth";
const router = express.Router();

router.post("/", auth.isAuthorized, questionController.ask);
router.post("/feedback", auth.isAuthorized, questionController.submitFeedback);
router.get("/costs", questionController.getQuestionCosts);

export default router;
