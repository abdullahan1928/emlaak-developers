// utils/jwt.js
import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET;

export const signToken = (payload: any) => {
  if (!secret) {
    throw new Error("JWT secret not provided");
  }

  return jwt.sign(payload, secret, { expiresIn: "1h" });
};

export const verifyToken = (token: string) => {
  try {
    if (!secret) {
      throw new Error("JWT secret not provided");
    }

    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
};
