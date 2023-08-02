import express from "express";
import { createAuction, getAllAuctions, getAllAuctionsByRegisterId, getSingleAuction, placeBid } from "../controllers/auction.controller";
import multer from "multer";

const auctionRouter = express.Router();
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/"); // Uploads will be saved in the "uploads" folder
    },
    filename: (req, file, cb) => {
      const timestamp = Date.now();
      cb(null, `${timestamp}-${file.originalname}`); // Appending timestamp to the original filename
    },
  });
  
  const upload = multer({ storage }); // Destination folder for file uploads

// Create auction with image upload
auctionRouter.post("/create-auction", upload.single("productImage"), createAuction);

// Place bid
auctionRouter.post("/auction/place-bid/:id", placeBid);

// Get all auctions data
auctionRouter.get("/auctions", getAllAuctions);

// Get data for a single auction by ID
auctionRouter.get("/auctions/:auctionId", getSingleAuction);

// Get all auctions data by registerBy ID
auctionRouter.get("/auctions/register/:registerId", getAllAuctionsByRegisterId);

export default auctionRouter;
