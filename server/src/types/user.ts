import { RequestHandler } from "express";

export interface UserRequest extends RequestHandler {
  body: {
    name: string;
    email: string;
    password: string;
  };
}
