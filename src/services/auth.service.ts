import { Helper } from "../classes/Helper";
import { addToBlacklist, verifyToken } from "../config/jwtConfig";
import { Messages } from "../constants/Messages";
import { HttpStatuses } from "../interfaces/IHttpStatuses";
import { UserSchema, UserModel } from "../models/authModal";

export const UserRegisterService = async (
    params: UserModel,
    callBack: Function
  ) => {
    try {
      let user = await UserSchema.find({
        mobileNumber: params.mobileNumber,
      });

      if (user && user.length) {
        return Helper.throwError(
          Messages.USER_EXIST,
          null,
          HttpStatuses.CONFLICT
        );
      }
      await UserSchema.create(params);
      callBack(true);
    } catch (error) {
      callBack(error);
    }
  };

  export const UserLoginServices = async (
    params: { mobileNumber: number; password: string },
    callBack: Function
  ) => {
    try {
      let user: any = await UserSchema.findOne(params).select("-password");
      let userMobile = await UserSchema.find({
        mobileNumber: params.mobileNumber,
      });
      let userPassword = await UserSchema.find({
        password: params.password,
      });
      if (
        userMobile &&
        userMobile.length &&
        userPassword &&
        userPassword.length
      ) {
        user = user.toObject();
        user.accessToken = await Helper.generateLoginToken(userMobile);
        callBack(user);
        return;
      }
      if (userMobile && !userMobile.length) {
        return Helper.throwError(
          Messages.MOBILE_NOT_EXIST,
          null,
          HttpStatuses.CONFLICT
        );
      }
      if (userPassword && !userPassword.length) {
        return Helper.throwError(
          Messages.WRONG_PASSWORD,
          null,
          HttpStatuses.CONFLICT
        );
      }
    } catch (error) {
      callBack(error);
    }
  };

  export const UserLogoutServices = async (accessToken: string | undefined, callBack: Function) => {
    if (!accessToken) {
      return Helper.throwError("Access token not provided.", null, HttpStatuses.BAD_REQUEST);
    }
  
    try {
      const decodedToken: any = await verifyToken(accessToken);
  
      if (!decodedToken) {
        return Helper.throwError("Invalid access token.", null, HttpStatuses.UNAUTHORIZED);
      }
  
      // Add the token to the blacklist (revoke it)
      addToBlacklist(accessToken);
  
      callBack({ success: true });
    } catch (error) {
      callBack(error);
    }
  };