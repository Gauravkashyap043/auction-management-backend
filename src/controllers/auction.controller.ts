import { Request, Response } from "express";
import { AuctionModel, Auction } from "../models/auctionModal";
import { verifyToken } from "../config/jwtConfig";
import { createAuctionService, getAllAuctionsByRegister, getAllAuctionsService, placeBidService } from "../services/auction.service";
// import { createAuctionService, placeBidService } from "../services/auctionService";
import multer from "multer";

const upload = multer({
    dest: "uploads/", // Specify the destination folder to save the uploaded image
    limits: {
        fileSize: 1 * 1024 * 1024, // Limit the file size to 1 MB
    },
}).single("productImage");

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

        // Call the upload middleware to handle the image upload
        upload(req, res, async (err: any) => {
            if (err) {
                return res.status(500).json({ error: "Failed to upload image" });
            }

            // Get the file path of the uploaded image from multer
            const productImage: string = req.file?.path || "";

            // Create the auction object
            const auction: Auction = {
                productName,
                details,
                startingBidPrice,
                auctionDuration,
                productImage,
                registerBy: token[0]._id, // Use the authenticated user's ID as the registerBy value
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

        return res.status(200).json(allAuctions);
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