import * as express from "express";

declare global {
  namespace Express {
    interface Request {
      cookies: { [key: string]: string | undefined };
    }
    interface Response {
      sendSuccess(any): void;
      sendError(message: string, status?: number): void;
    }
  }
}