import { AnySchema } from "yup";
import { Request, Response, NextFunction } from "express";
import { removeFiles } from "../utils/removeFile";

const validate =
  (schema: AnySchema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validate({
        body: req.body,
        files: req.files,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (err: any) {
      if (req.files) {
        let files: string[] = [];
        Object.entries(req.files).forEach(([key, value]) => {
          files = [
            ...files,
            ...value.map((file: any) => `${file.destination}/${file.filename}`),
          ];
        });
        removeFiles(files);
      }
      return res.status(400).send(err.errors);
    }
  };

export default validate;
