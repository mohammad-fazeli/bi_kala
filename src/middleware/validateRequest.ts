import { AnySchema } from "yup";
import { Request, Response, NextFunction } from "express";

const validate =
  (schema: AnySchema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validate({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (err: any) {
      return res.status(400).send(err.errors);
    }
  };

export default validate;
