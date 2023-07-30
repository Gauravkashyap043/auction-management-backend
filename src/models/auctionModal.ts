import { model, Schema } from "mongoose";
import { IDatabaseSchema } from "../interfaces/IDatabaseSchema";
type ObjectId = Schema.Types.ObjectId;

export interface Auction {
  productName: string;
  details: string;
  startingBidPrice: number;
  auctionDuration: number; // in hours
  productImages: string[]; // array to store multiple image URLs
  registerBy: ObjectId; // reference to the user who registered the auction
  bids: {
    bidder: ObjectId; // reference to the user who placed the bid
    bidAmount: number;
    bidTime: Date;
  }[];
  createdAt?: Date; // Add createdAt property to match Mongoose's Document type
  updatedAt?: Date; // Add updatedAt property to match Mongoose's Document type
}

const auctionSchema = new Schema<Auction>(
  {
    productName: {
      type: String,
      required: true,
    },
    details: {
      type: String,
      required: true,
    },
    startingBidPrice: {
      type: Number,
      required: true,
      min: 0, // Minimum starting bid price should be 0 or greater
    },
    auctionDuration: {
      type: Number,
      required: true,
      min: 1, // Minimum auction duration should be 1 hour or greater
    },
    productImages: {
      type: [String],
      required: true,
    },
    registerBy: {
      type: Schema.Types.ObjectId,
      required: false,
      ref: IDatabaseSchema.AUCTION_DATA,
    },
    bids: [
      {
        bidder: {
          type: Schema.Types.ObjectId,
          required: false,
          ref: IDatabaseSchema.AUCTION_DATA,
        },
        bidAmount: {
          type: Number,
          required: true,
        },
        bidTime: {
          type: Date,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true, // You can use timestamps to automatically manage createdAt and updatedAt fields
  }
);

export const AuctionModel = model<Auction>(
  IDatabaseSchema.PRODUCT_DATA,
  auctionSchema
  
);
