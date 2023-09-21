import { NextFunction, RequestHandler } from "express";
import formidable from "formidable";
import { IncomingMessage } from "http";
import { FilesRequest } from "types/files.request";

export const fileParserMiddleware = async (req: FilesRequest, res: any, next: NextFunction) => {
  req.headers["content-type"];

  if (!req.headers["content-type"]?.startsWith("multipart/form-data")) {
    return res.status(422).json({
      error: "Format type not supported !",
    });
  }

  const form = formidable({ multiples: false });

  // const shallowReq = req as unknown as IncomingMessage;

  form.parse(req, (err, fields, files) => {
    if (err) {
      next(err);
    }

    (req.body as any) = fields;
    req.files = files;

    next();
  });
};
