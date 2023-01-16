import express from "express";
import userController from "../controller/userController";

const router = express.Router();

router.get("/ping", (_, res) => res.status(200).send("Server is healthy!"));
router.get("/", userController.incrementCount);

export default router;
