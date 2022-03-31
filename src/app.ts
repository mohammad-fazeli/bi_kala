import express, { Express, Request, Response } from "express";
import userRouter from "./routers/user.router";
import categoryRouter from "./routers/category.router";
import productRouter from "./routers/product.router";
import filterRouter from "./routers/filter.router";

const app: Express = express();

app.use(express.json({ limit: "10mb" }));
app.use(express.static("public"));

app.use("/api/user", userRouter);
app.use("/api/category", categoryRouter);
app.use("/api/product", productRouter);
app.use("/api/filter", filterRouter);

app.get("/", (req: Request, res: Response) => {
  res.sendStatus(200);
});

export default app;
