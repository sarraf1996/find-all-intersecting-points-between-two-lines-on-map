import express from "express";
import bodyParser from "body-parser";

import dotenv from "dotenv";

import router from "./routes/route.js";

const app = express();

dotenv.config();

app.use(bodyParser.json({ extended: true, limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", router);

const port = parseInt(process.env.PORT) || 8000;

app.listen(port, () =>
  console.log(`Server is running successfully on PORT ${port}`)
);
