import { Router, Request, Response } from "express";
import { cats } from "./types";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.send(cats);
});

export default router;
