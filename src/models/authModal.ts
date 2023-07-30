import { model, Schema } from "mongoose";
import { IDatabaseSchema } from "../interfaces/IDatabaseSchema";

export interface UserModel {
  fullName: string;
  mobileNumber: number;
  password: string;
  createdAt?: Date;
  updateAt?: Date;
}

const schema = new Schema<UserModel>({
  fullName: { type: String, required: true },
  mobileNumber: { type: Number, require: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now },
});

export const UserSchema = model<UserModel>(
  IDatabaseSchema.USER_DATA,
  schema
);
