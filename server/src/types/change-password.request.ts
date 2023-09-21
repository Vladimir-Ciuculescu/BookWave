import { RequestHandler } from "express";

export interface ChangePasswordRequest extends RequestHandler {
  body: {
    password: string;
    userId: string;
  };
}
