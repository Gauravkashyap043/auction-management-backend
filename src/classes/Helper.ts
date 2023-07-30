import crypto from "crypto";
import { sign } from "jsonwebtoken";
import process from "process";
import nodemailer from "nodemailer";
import { Environment } from "../constants/Environment";

export class Helper {
  static throwError(message: string, error?: any, statusCode?: number) {
    const errorObj = {
      error,
      message,
      statusCode,
    };
    throw errorObj;
  }

  static hashPassword(password: string) {
    return crypto.pbkdf2Sync(password, "", 100, 64, `sha512`).toString();
  }

  static async generateLoginToken(loginData: object) {
    let token = await sign(
      {
        ...loginData,
      },
      process.env.JWT_SECRET_TOKEN,
      { expiresIn: "8h" }
    );
    token = `Bearer ${token}`;
    return token;
  }

  static getFormattedDate() {
    const currentDate = new Date();
    const year = currentDate.getFullYear().toString();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const date = currentDate.getDate().toString().padStart(2, '0');
    return `${date}${month}${year}`;
  }
}

  // static async sendEmail(emailId: string, callBack: Function) {
  //   let transporter = nodemailer.createTransport({
  //     service: "gmail",
  //     auth: {
  //       type: "OAuth2",
  //       user: Environment.EMAIL,
  //       pass: Environment.PASSWORD_SALT_SECRET,
  //       clientId: Environment.CLIENT_ID,
  //       clientSecret: Environment.CLIENT_SECRET,
  //       refreshToken: Environment.REFRESH_TOKEN,
  //     },
  //   });

  //   let mailOptions = {
  //     from: Environment.EMAIL,
  //     to: emailId,
  //     subject: "easy hrms Project",
  //     text: "Hi from easy hrms Project",
  //   };
  //   transporter.sendMail(mailOptions, function (err, data) {
  //     if (err) {
  //       callBack(false);
  //     } else {
  //       return callBack(true);
  //     }
  //   });
  // }
// }
