import app from "./app";
import dotenv from "dotenv";

import connect from "./db/connect";

dotenv.config({ path: ".env" });

connect()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`app is running in http://localhost:${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error(err);
  });
