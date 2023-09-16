import { RequestHandler } from "express";
import * as Yup from "yup";

export const validate = (schema: any): RequestHandler => {
  return async (req, res, next) => {
    if (!req.body) {
      return res.status(422).json({ error: "The request has no attached body !" });
    }

    const schemaToValidate = Yup.object({ body: schema });

    try {
      await schemaToValidate.validate(
        {
          body: req.body,
        },
        { abortEarly: true },
      );
      next();
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        return res.status(422).json({ error: error.message });
      }
    }
  };
};
