import express from "express";
import dotenv from "dotenv";
import { dbConnectionMiddleware } from "./config/dbConnection";
import router from "./routes";

const cors = require("cors");
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded());
app.use(dbConnectionMiddleware);
app.use(router);

// app.get("/", (req, res) => {
//   res.send("What's up my");
// });

app.listen(process.env.BACK_PORT, () => {
  console.log(
    `server running : https://${process.env.BACK_HOST}:${process.env.BACK_PORT}`
  );
});
