import express from "express";
import eventController from "../controller/eventController";

const router = express.Router();

router.post("/uniqueUsers", eventController.countUniqueUsers);
router.post("/callToAction", eventController.countUniqueCallToAction);

export default router;
