import { AuctionModel, Auction } from "../models/auctionModal";
import { ObjectId } from "mongoose";


export const createAuctionService = async (auction: Auction): Promise<Auction> => {
  try {
    const createdAuction = await AuctionModel.create(auction);

    // Modify the productImage URL to remove 'upload//'
    if (createdAuction.productImage) {
      createdAuction.productImage = createdAuction.productImage.replace("upload/", "");
    }

    return createdAuction;
  } catch (error) {
    throw new Error("Failed to create auction");
  }
};

export const placeBidService = async (
  auctionId: string,
  bidder: ObjectId, // Change the type to ObjectId
  bidAmount: number,
  callBack: Function
) => {
  try {
    // Find the auction by ID
    const auction = await AuctionModel.findById(auctionId);

    if (!auction) {
      callBack(false, { error: "Auction not found" });
      return;
    }

    // Check if the auction is still ongoing based on the auction duration
    const currentTime = new Date();
    const auctionEndTime = new Date(auction.createdAt);
    auctionEndTime.setHours(auctionEndTime.getHours() + auction.auctionDuration);
    if (currentTime >= auctionEndTime) {
      callBack(false, { error: "Auction has ended" });
      return;
    }

    // Check if the new bid is higher than the current highest bid
    const highestBid = auction.bids.reduce(
      (maxBid, bid) => Math.max(maxBid, bid.bidAmount),
      auction.startingBidPrice
    );
    if (bidAmount <= highestBid) {
      callBack(false, {
        error: "Bid amount should be higher than the current highest bid",
      });
      return;
    }

    // Add the new bid to the "bids" array
    auction.bids.push({
      bidder,
      bidAmount,
      bidTime: new Date(),
    });

    // Save the updated auction with the new bid
    await auction.save();

    callBack(true, { message: "Bid placed successfully" });
  } catch (error) {
    callBack(false, error);
  }
};


export const getAllAuctionsService = async (): Promise<Auction[]> => {
  try {
    const allAuctions = await AuctionModel.find()
      .populate("registerBy", "-password") // Populate the registerBy field and exclude the password field
      .populate("bids.bidder", "-password") // Populate the bidder field in the bids array and exclude the password field
      .exec();

    return allAuctions;
  } catch (error) {
    throw new Error("Failed to fetch all auctions");
  }
};

export const getAllAuctionsByRegister = async (registerById: string): Promise<Auction[]> => {
  try {
    const allAuctions = await AuctionModel.find({ registerBy: registerById })
      .populate("registerBy", "-password") // Populate the registerBy field and exclude the password field
      .populate("bids.bidder", "-password") // Populate the bidder field in the bids array and exclude the password field
      .exec();

    return allAuctions;
  } catch (error) {
    throw new Error("Failed to fetch auctions by registerBy");
  }
};