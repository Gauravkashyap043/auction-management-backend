import express from "express";
import { RequestValidation } from "../classes/RequestValidation";
import { requestValidationConfig } from "../config/requestValidationConfig";
import { userLogin, userLogout, userRegister } from "../controllers/auth.controller";

const authRouter = express.Router();

authRouter.post(
  "/register",
  RequestValidation.validateFunction(requestValidationConfig.userRegister),
  userRegister
);

authRouter.post(
  "/login",
  RequestValidation.validateFunction(requestValidationConfig.userLogin),  
  userLogin
);

authRouter.post("/logout", userLogout);


export default authRouter;
