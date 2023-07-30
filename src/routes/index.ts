import express from "express";
import authRouter from "./auth.route";
import auctionRouter from "./auction.route";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/",auctionRouter)

export default router;
