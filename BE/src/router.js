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
const data_1 = require("../data");
const prisma = new client_1.PrismaClient();
const router = (0, express_1.Router)();
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Fetching comments from the database...");
        const comments = yield prisma.comment.findMany({
            include: {
                user: { include: { image: true } },
                replies: { include: { user: true } },
            },
        });
        console.log("Fetched comments:", comments);
        if (comments.length === 0) {
            console.log("No comments found, returning mock comments.", data_1.mockComments);
            return res.json(data_1.mockComments);
        }
        return res.json(comments);
    }
    catch (error) {
        console.error("Error fetching comments:", error);
        return res.status(500).json({ error: "Error fetching comments" });
    }
}));
router.post("/comments", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { content } = req.body;
        // Log the incoming data
        console.log("Received data:", { content });
        if (!content) {
            return res.status(400).json({ error: "Content is required" });
        }
        // Create the comment
        const newComment = yield prisma.comment.create({
            data: {
                content,
                score: 0,
            },
        });
        // Log the new comment creation
        console.log("New comment created:", newComment);
        res.status(201).json(newComment);
    }
    catch (error) {
        console.error("Error creating comment:", error);
        res.status(500).json({ error: "Error creating comment" });
    }
}));
exports.default = router;
