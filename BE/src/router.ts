import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { mockComments } from "../data";

const prisma = new PrismaClient();
const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    console.log("Fetching comments from the database...");
    const comments = await prisma.comment.findMany({
      include: {
        user: { include: { image: true } },
        replies: { include: { user: true } },
      },
    });

    console.log("Fetched comments:", comments);

    if (comments.length === 0) {
      console.log("No comments found, returning mock comments.", mockComments);
      return res.json(mockComments);
    }

    return res.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return res.status(500).json({ error: "Error fetching comments" });
  }
});

router.post("/comments", async (req: Request, res: Response) => {
  try {
    const { content } = req.body;

    // Log the incoming data
    console.log("Received data:", { content });

    if (!content) {
      return res.status(400).json({ error: "Content is required" });
    }

    // Create the comment
    const newComment = await prisma.comment.create({
      data: {
        content,
        score: 0,
      },
    });

    // Log the new comment creation
    console.log("New comment created:", newComment);

    res.status(201).json(newComment);
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ error: "Error creating comment" });
  }
});

export default router;
