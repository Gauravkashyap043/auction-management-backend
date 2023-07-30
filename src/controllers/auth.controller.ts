import { Request, Response } from "express";
import { HttpResponse } from "../classes/HttpResponse";
import { HttpStatuses } from "../interfaces/IHttpStatuses";
import { Helper } from "../classes/Helper";
import { verifyToken } from "../config/jwtConfig";
import { Messages } from "../constants/Messages";
import { UserLoginServices, UserLogoutServices, UserRegisterService } from "../services/auth.service";

export const userRegister = async (req: Request, res: Response) => {
  const params = {
    fullName: req.body.fullName,
    mobileNumber: req.body.mobileNumber,
    password: Helper.hashPassword(req.body.password),
  };
  try {
    UserRegisterService(params, (result: boolean) => {
      if (result === true) {
        return new HttpResponse(
          res,
          result ? "You are registered successfully" : "Failed",
          result,
          result ? HttpStatuses.OK : HttpStatuses.BAD_REQUEST
        ).sendResponse();
      }
      new HttpResponse(res).sendErrorResponse(result);
    });
  } catch (error) {
    new HttpResponse(res).sendErrorResponse(error);
  }
};

export const userLogin = async (req: Request, res: Response) => {
  const params = {
    mobileNumber: req.body.mobileNumber,
    password: Helper.hashPassword(req.body.password),
  };
  try {
    UserLoginServices(params, (result: any) => {
      if (result && result.accessToken) {
        return new HttpResponse(
          res,
          "Logged in successfully.",
          result,
          HttpStatuses.OK
        ).sendResponse();
      }
      new HttpResponse(res).sendErrorResponse(result);
    });
  } catch (error) {
    new HttpResponse(res).sendErrorResponse(error);
  }
};



export const userLogout = async (req: Request, res: Response) => {
  const accessToken = req.header("Authorization")?.replace("Bearer ", "");

  try {
    await UserLogoutServices(accessToken, (result: any) => {
      new HttpResponse(res, "Logged out successfully.", result, HttpStatuses.OK).sendResponse();
    });
  } catch (error) {
    new HttpResponse(res).sendErrorResponse(error);
  }
};