import { RequestHandler } from "express";

export interface User extends RequestHandler {
  body: {
    name: string;
    email: string;
    password: string;
  };
}
