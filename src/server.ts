import app from "./app";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

app.listen(process.env.PORT, () => {
  console.log(`app is running in http://localhost:${process.env.PORT}`);
});
