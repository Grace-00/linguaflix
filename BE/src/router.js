"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const router = (0, express_1.Router)();
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
router.post("/submit-data", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, nativeLanguage, targetLanguage, proficiencyLevel, favoriteShow, } = req.body;
        // Log the incoming data
        console.log("Received data:", {
            name,
            email,
            nativeLanguage,
            targetLanguage,
            proficiencyLevel,
            favoriteShow,
        });
        if (!name ||
            !email ||
            !nativeLanguage ||
            !targetLanguage ||
            !proficiencyLevel ||
            !favoriteShow) {
            return res.status(400).json({ error: "Data is required" });
        }
        // Create the user
        const user = yield prisma.user.create({
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
    }
    catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ error: "Failed to save data" });
    }
}));
exports.default = router;
