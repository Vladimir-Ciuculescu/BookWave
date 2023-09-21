import { RequestHandler } from "express";

export interface VerifyPasswordResetTokenRequest extends RequestHandler {
  body: {
    token: string;
    userId: string;
  };
}
