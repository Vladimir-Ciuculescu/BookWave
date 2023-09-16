import { RequestHandler } from "express";

export interface ReVerifyEmailRequest extends RequestHandler {
  body: {
    userId: string;
  };
}
