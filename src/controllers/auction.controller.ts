import { Request, Response } from "express";
import { AuctionModel, Auction } from "../models/auctionModal";
import { verifyToken } from "../config/jwtConfig";
import { createAuctionService, placeBidService } from "../services/auction.service";
// import { createAuctionService, placeBidService } from "../services/auctionService";


export const createAuction = async (req: Request, res: Response) => {
  try {
    // Verify the token to check if the user is authenticated
    const token = await verifyToken(req.headers.authorization);
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Extract data from the request body
    const {
      productName,
      details,
      startingBidPrice,
      auctionDuration,
      productImages,
      registerBy,
    } = req.body;

    // Validate the data as per your requirements
    if (
      !productName ||
      !details ||
      startingBidPrice < 0 ||
      auctionDuration < 1
    ) {
      return res.status(400).json({ error: "Invalid input data" });
    }

    // Check if the token user is allowed to create auctions
    if (token.userType !== "seller") {
      return res.status(403).json({ error: "Unauthorized to create auctions" });
    }

    // Create the auction object
    const auction: Auction = {
      productName,
      details,
      startingBidPrice,
      auctionDuration,
      productImages,
      registerBy: token.userId, // Use the authenticated user's ID as the registerBy value
      bids: [],
    };

    createAuctionService(auction, (success: boolean, data: any) => {
      if (success) {
        return res.status(201).json(data);
      } else {
        console.error("Error creating auction:", data);
        return res.status(500).json({ error: "Failed to create auction" });
      }
    });
  } catch (error) {
    console.error("Error creating auction:", error);
    return res.status(500).json({ error: "Failed to create auction" });
  }
};

export const placeBid = async (req: Request, res: Response) => {
  try {
    const auctionId = req.params.id;
    const bidAmount = req.body.bidAmount;

    // Verify the token to check if the user is authenticated
    const token = await verifyToken(req.headers.authorization);
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Validate the bid amount as per your requirements
    if (bidAmount <= 0) {
      return res.status(400).json({ error: "Invalid bid amount" });
    }

    // Check if the token user is allowed to place bids
    if (token.userType !== "buyer") {
      return res.status(403).json({ error: "Unauthorized to place bids" });
    }

    placeBidService(auctionId, token.userId, bidAmount, (success: boolean, data: any) => {
      if (success) {
        return res.status(200).json(data);
      } else {
        console.error("Error placing bid:", data);
        return res.status(500).json({ error: "Failed to place bid" });
      }
    });
  } catch (error) {
    console.error("Error placing bid:", error);
    return res.status(500).json({ error: "Failed to place bid" });
  }
};
