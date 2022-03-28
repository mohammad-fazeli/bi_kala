import express, { Express, Request, Response } from "express";

const app: Express = express();

app.get("/", (req: Request, res: Response) => {
  res.sendStatus(200);
});

export default app;
