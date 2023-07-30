import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import process from "process";

export const setUpDbConnection = (dbName: string) => {
  return new Promise<void>((resolve, reject) => {
    mongoose.connection.close().then(() => {
      console.log("Disconnected Successfully...");
      mongoose
        .connect(`${process.env.DB_URL}${dbName}`)
        .then(() => {
          console.log("Database connection established successfully.");
          resolve();
        })
        .catch((error) => {
          console.error("Connection error:-", error);
          reject(error);
        });
    });
  });
};

export const dbConnectionMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  await setUpDbConnection("Auction");
  next();
};
