import { body } from "express-validator";

export const requestValidationConfig = {
  userRegister: [
    body("fullName", "Please enter valid name.").exists(),
    body("mobileNumber", "Enter a valid mobile number").isLength({
      min: 10,
      max: 10,
    }),
    body("password", "Password should be minimum 6 characters.")
      .exists()
      .isLength({ min: 6 }),
  ],
  userLogin: [
    body("mobileNumber", "Enter a valid mobile number").isLength({
      min: 10,
      max: 10,
    }),
    body("password", "Password should be minimum 6 characters."),
  ],
};
