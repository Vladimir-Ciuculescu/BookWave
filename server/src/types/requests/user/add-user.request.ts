import { RequestHandler } from "express";

export interface AddUserRequest extends RequestHandler {
  body: {
    name: string;
    email: string;
    password: string;
  };
}
