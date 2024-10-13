import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { getSentence } from "./utils.js";
import { sendEmail } from "./mailjet.js";
import fs from "fs/promises";
import { __filename, __dirname } from "./utils.js";
import path from "path";

const prisma = new PrismaClient();
const router = Router();

const subtitlesFolder = path.join(__dirname, "../subtitles");

type ShowFilePath = {
  [showName: string]: string;
};

//TODO: optimise for more episodes/shows
const SHOW_FILE_PATH: ShowFilePath = {
  "Station 19": "../subtitles/station-19-s07e01.srt",
  "9-1-1": "../subtitles/9-1-1-s01e01.srt",
};

router.get("/subtitles", async (req: Request, res: Response) => {
  try {
    const subtitleFiles = await fs.readdir(subtitlesFolder);
    const subtitles = subtitleFiles.map((file) => ({
      name: file
        .replace(".srt", "")
        .replace(/-/g, " ")
        .replace(/s\d{2}/i, "") // Remove 's01', 's02', etc.
        .replace(/e\d{2}/i, "") // Remove 'e01', 'e02', etc.
        .trim() // Remove leading/trailing whitespace
        .toLowerCase(),

      fileName: file,
    }));

    res.json(subtitles);
  } catch (error) {
    console.error("Error fetching subtitles:", error);
    res.status(500).send("Error fetching subtitles");
  }
});

router.get("/", (req: Request, res: Response) => {
  res
    .status(404)
    .json({ message: "heeelllooooo server! This API has not been found." });
});

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
    const filePath = SHOW_FILE_PATH[favoriteShow];

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

    // Check for existing user by email
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    let user;

    //TODO: improve if else
    if (existingUser) {
      // If the user exists, update their information if needed
      user = await prisma.user.update({
        where: { email },
        data: {
          name,
          nativeLanguage,
          targetLanguage,
          proficiencyLevel,
          // favoriteShow is not updated directly here so that one user can have multiple
          // favorite tv shows
        },
      });

      // Don't store favoriteShow if there is no subtitle available for existing user
      if (!filePath) {
        return res.status(404).json({
          error:
            "Favorite show not created for existing user because there's no found file path associated to it",
        });
      } else {
        // Create a new favorite show entry linked to the existing user
        await prisma.favoriteShow.create({
          data: {
            userId: user.id,
            showName: favoriteShow,
          },
        });
      }
    } else {
      // Don't store favoriteShow if there is no subtitle available for new user
      if (!filePath) {
        return res.status(404).json({
          error:
            "Favorite show not created for the new user because there's no found file path associated to it",
        });
      } else {
        // If the user does not exist, create a new user
        user = await prisma.user.create({
          data: {
            name,
            email,
            nativeLanguage,
            targetLanguage,
            proficiencyLevel,
            favoriteShow,
          },
        });
        // Create a new favorite show entry for the new user
        await prisma.favoriteShow.create({
          data: {
            userId: user.id,
            showName: favoriteShow,
          },
        });
      }
    }

    // Fetch subtitle based on favoriteShow TODO: implement different target language
    const sentence = await getSentence(
      filePath,
      proficiencyLevel,
      targetLanguage
    );

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
