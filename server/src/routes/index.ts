import express from "express";

const router = express.Router();

router.get("/ping", (_, res) => res.status(200).send("Server is healthy!"));

export default router;
