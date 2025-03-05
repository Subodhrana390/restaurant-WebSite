import express from "express";
import { dbConnection } from "./Database/dbConnection.js";
import { bootstrap } from "./src/bootstrap.js";
import dotenv from "dotenv";
dotenv.config();
import morgan from "morgan";
import cors from "cors";
const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("uploads"));

dbConnection();
bootstrap(app);

app.listen(port, () => console.log(`server listening on port ${port}!`));
