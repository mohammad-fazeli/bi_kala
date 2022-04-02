import express, { Express, Request, Response } from "express";
import userRouter from "./routers/user.router";
import categoryRouter from "./routers/category.router";
import productRouter from "./routers/product.router";
import filterRouter from "./routers/filter.router";
import cartRouter from "./routers/cart.router";
import paymentRouter from "./routers/payment.router";
import checkoutRouter from "./routers/checkout.router";

const app: Express = express();

app.use(express.json({ limit: "10mb" }));
app.use(express.static("public"));

app.use("/api/user", userRouter);
app.use("/api/category", categoryRouter);
app.use("/api/product", productRouter);
app.use("/api/filter", filterRouter);
app.use("/api/cart", cartRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/checkout", checkoutRouter);

app.get("/", (req: Request, res: Response) => {
  res.sendStatus(200);
});

export default app;
