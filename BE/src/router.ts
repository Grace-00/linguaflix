import { Router, Request, Response } from "express";
import { comments } from "../types";
import { uuid } from "uuidv4";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.send(comments);
});

router.post("/comments", (req: Request, res: Response) => {
  //this is so so sooo cool. Next step: fix types and make image keys not required
  comments.push({
    content: "new content",
    createdAt: String(Date.now()),
    replies: [],
    id: Number(uuid()),
    score: Number(uuid()),
    user: { image: { png: "hello", webp: "webp" }, username: "pippo" },
  });
  res.send({ comments });
});

export default router;
