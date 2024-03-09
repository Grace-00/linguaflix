import { Router, Request, Response } from "express";
import { comments } from "./types";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.send(comments);
});

export default router;
