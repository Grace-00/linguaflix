import express, { Express, Request, Response } from "express";
import morgan from "morgan";
import router from "./router";
const app: Express = express();
const port = 3000;

app.use(morgan("dev")); //middleware for logging on dev (ex. GET)
app.use(express.json()); //middleware that allows a client to send us json
app.use(express.urlencoded({ extended: true })); //middleware that allows query string to be encoded and decoded, to be in an object rather than strings
app.use("/api", router); //this is used to create modular routes

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
