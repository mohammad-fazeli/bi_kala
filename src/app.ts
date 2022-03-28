import express, { Express, Request, Response } from "express";
import userRouter from "./routers/user.router";

const app: Express = express();

app.use(express.json({ limit: "10mb" }));
app.use("/api/user", userRouter);

app.get("/", (req: Request, res: Response) => {
  res.sendStatus(200);
});

export default app;
