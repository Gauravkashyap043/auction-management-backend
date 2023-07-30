import { verify } from "jsonwebtoken";
import process from "process";

export const verifyToken = async (token: string) => {
  try {
    if (token) {
      let authToken = token.replace("Bearer ", "");
      const decoded = await verify(authToken, process.env.JWT_SECRET_TOKEN);
      return decoded;
    }
  } catch (error) {
    return null;
  }
};



// Function to verify the token and return the decoded data


// Function to add the token to the blacklist (simulate token revocation)
const revokedTokens: string[] = []; // Maintain a list of revoked tokens (you can use a database for this in production)

export const addToBlacklist = (token: string) => {
  revokedTokens.push(token);
};

// Function to check if the token is in the blacklist
export const isTokenRevoked = (token: string) => {
  return revokedTokens.includes(token);
};
