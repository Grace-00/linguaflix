import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();
//   try {
//     console.log("Fetching comments from the database...");
//     const comments = await prisma.comment.findMany({
//       include: {
//         user: { include: { image: true } },
//         replies: { include: { user: true } },
//       },
//     });

//     console.log("Fetched comments:", comments);

//     if (comments.length === 0) {
//       console.log("No comments found, returning mock comments.", mockComments);
//       return res.json(mockComments);
//     }

//     return res.json(comments);
//   } catch (error) {
//     console.error("Error fetching comments:", error);
//     return res.status(500).json({ error: "Error fetching comments" });
//   }
// });

router.post("/submit-data", async (req: Request, res: Response) => {
  try {
    const {
      name,
      email,
      nativeLanguage,
      targetLanguage,
      proficiencyLevel,
      favoriteShow,
    } = req.body;

    // Log the incoming data
    console.log("Received data:", {
      name,
      email,
      nativeLanguage,
      targetLanguage,
      proficiencyLevel,
      favoriteShow,
    });

    if (
      !name ||
      !email ||
      !nativeLanguage ||
      !targetLanguage ||
      !proficiencyLevel ||
      !favoriteShow
    ) {
      return res.status(400).json({ error: "Data is required" });
    }

    // Create the user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        nativeLanguage,
        targetLanguage,
        proficiencyLevel,
        favoriteShow,
      },
    });

    console.log("New user created:", user);

    // Fetch subtitle based on favoriteShow and proficiencyLevel

    // Send email

    res.status(201).json(user);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to save data" });
  }
});

export default router;
