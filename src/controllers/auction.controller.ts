import { Request, Response } from "express";
import { AuctionModel, Auction } from "../models/auctionModal";
import { verifyToken } from "../config/jwtConfig";
import { createAuctionService, getAllAuctionsByRegister, getAllAuctionsService, placeBidService } from "../services/auction.service";
// import { createAuctionService, placeBidService } from "../services/auctionService";

export const createAuction = async (req: Request, res: Response) => {
  try {
    const token = await verifyToken(req.headers.authorization);
    if (!token) {
      return res.status(401).json({ error: "Unauthorized access" });
    }
    // Extract data from the request body
    const {
      productName,
      details,
      startingBidPrice,
      auctionDuration,
    } = req.body;

    // Validate the data as per your requirements
    // For example, check if all required fields are present and startingBidPrice is a positive number.
    const auctionDurationInMinutes = parseInt(auctionDuration, 10);
    const auctionEndTime = new Date();
    auctionEndTime.setMinutes(auctionEndTime.getMinutes() + auctionDurationInMinutes);
    const productImage = req.file ? req.file.path : undefined;

    // Create the auction object
    const auction: Auction = {
      productName,
      details,
      startingBidPrice,
      auctionDuration,
      productImage,
      auctionEndTime,
      registerBy: token[0]._id,
      bids: [], // Initialize with an empty array of bids
    };
    console.log("req.file:---------", req.file); // Check the uploaded file information
    console.log("req.body:---------", req.body);
    // Save the auction to the database
    const createdAuction = await AuctionModel.create(auction);


    // Respond with the created auction object
    return res.status(201).json(createdAuction);
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

    // Get the auction by ID to check the current highest bid amount
    const auction = await AuctionModel.findById(auctionId).exec();

    if (!auction) {
      return res.status(404).json({ error: "Auction not found" });
    }

    const highestBid = auction.bids.reduce((maxBid, bid) => {
      return bid.bidAmount > maxBid ? bid.bidAmount : maxBid;
    }, 0);

    if (bidAmount <= highestBid) {
      return res
        .status(400)
        .json({ error: "Your bid amount should be higher than the current highest bid" });
    }

    // Place the bid using the placeBidService function
    placeBidService(auctionId, token[0]._id, bidAmount, (success: boolean, data: any) => {
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


export const getAllAuctions = async (req: Request, res: Response) => {
  try {
    const allAuctions = await getAllAuctionsService();

    // Modify the allAuctions array to include the image URL for each auction
    const auctionsWithImageUrls = allAuctions.map((auction) => {
      return {
        // @ts-ignore
        ...auction.toObject(),
        productImage: `/${auction.productImage}`, // Include the correct URL
      };
    });

    return res.status(200).json(auctionsWithImageUrls);
  } catch (error) {
    console.error("Error fetching all auctions:", error);
    return res.status(500).json({ error: "Failed to fetch all auctions" });
  }
};
export const getSingleAuction = async (req: Request, res: Response) => {
  try {
    const auctionId = req.params.auctionId; // Assuming the auction ID is passed in the request parameters

    // Find the auction by ID
    const auction = await AuctionModel.findById(auctionId)
      .populate("registerBy", "-password") // Populate the registerBy field and exclude the password field
      .populate("bids.bidder", "-password") // Populate the bidder field in the bids array and exclude the password field
      .exec();

    if (!auction) {
      return res.status(404).json({ error: "Auction not found" });
    }

    auction.productImage = `/${auction.productImage}`;

    return res.status(200).json(auction);
  } catch (error) {
    console.error("Error fetching single auction:", error);
    return res.status(500).json({ error: "Failed to fetch the auction" });
  }
};

export const getAllAuctionsByRegisterId = async (req: Request, res: Response) => {
  try {
    const registerById = req.params.registerId; // Assuming the registerBy ID is passed in the request parameters

    const allAuctions = await getAllAuctionsByRegister(registerById);

    return res.status(200).json(allAuctions);
  } catch (error) {
    console.error("Error fetching auctions by registerBy:", error);
    return res.status(500).json({ error: "Failed to fetch auctions by registerBy" });
  }
};