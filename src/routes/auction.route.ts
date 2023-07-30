import express from "express";
import { createAuction, getAllAuctions, getAllAuctionsByRegisterId, getSingleAuction, placeBid } from "../controllers/auction.controller";


const auctionRouter = express.Router();
//create auction
auctionRouter.post("/create-auction", createAuction);
//place bid
auctionRouter.post("/auction/:id/place-bid", placeBid);
// Get all auctions data
auctionRouter.get("/auctions", getAllAuctions);
// Get data for a single auction by ID
auctionRouter.get("/auctions/:auctionId", getSingleAuction);
// Get all auctions data by registerBy ID
auctionRouter.get("/auctions/register/:registerId", getAllAuctionsByRegisterId);


export default auctionRouter;
