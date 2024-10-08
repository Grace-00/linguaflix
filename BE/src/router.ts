import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { getBeginnerSentence } from "./utils.js";
import { sendEmail } from "./mailjet.js";

const prisma = new PrismaClient();
const router = Router();

type ShowFilePath = {
  [showName: string]: string;
};

//TODO: optimise for more episodes/shows
const SHOW_FILE_PATH: ShowFilePath = {
  "Station 19": "../subtitles/station-19-s07e01.srt",
  "9-1-1": "../subtitles/9-1-1-s01e01.srt",
};

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

    const filePath = SHOW_FILE_PATH[favoriteShow];

    // Fetch subtitle based on favoriteShow TODO: implement proficiencyLevel
    const sentence = await getBeginnerSentence(filePath);

    if (!sentence) {
      return res.status(404).json({ error: "Subtitle not found" });
    }

    console.log("Fetched subtitle:", sentence);

    // Send email
    await sendEmail(
      email,
      "Your Learning Sentence",
      `Here is your personalized sentence: ${sentence}`
    );

    console.log("Email sent to:", email);

    res.status(201).json(user);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to save data" });
  }
});

export default router;
