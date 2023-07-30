import express from "express";
import { createAuction, placeBid } from "../controllers/auction.controller";


const auctionRouter = express.Router();

auctionRouter.post("/create-auction", createAuction);
auctionRouter.post("/auction/:id/place-bid", placeBid);


export default auctionRouter;
