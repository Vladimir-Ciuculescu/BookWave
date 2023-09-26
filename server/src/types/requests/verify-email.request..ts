import { RequestHandler } from "express";

export interface VerifyEmailRequest extends RequestHandler {
  body: {
    token: string;
    userId: string;
  };
}
