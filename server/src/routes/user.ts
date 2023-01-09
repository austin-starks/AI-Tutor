import express from "express";
import userController from "../controller/userController";
import authenticationController from "../controller/userController";
import auth from "../middleware/auth";
const router = express.Router();

router.get("/balance", auth.isAuthorized, userController.getBalance);
router.post("/login", authenticationController.login);
router.post("/register", authenticationController.register);
router.post("/logout", authenticationController.logout);

export default router;
