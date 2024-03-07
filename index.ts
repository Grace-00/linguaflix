import express, { Express, Request, Response } from "express";
import router from "./router";
const app: Express = express();
const port = 3000;

app.use("/api", router); //this is used to create modular routes

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
