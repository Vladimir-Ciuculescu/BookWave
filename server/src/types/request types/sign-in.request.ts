import { RequestHandler } from "express";

export interface SignInRequest extends RequestHandler {
  body: {
    email: string;
    password: string;
  };
}
