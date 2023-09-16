import { RequestHandler } from "express";

export interface ForgotPasswordRequest extends RequestHandler {
  body: {
    email: string;
  };
}
