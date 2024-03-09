"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const types_1 = require("./types");
const uuidv4_1 = require("uuidv4");
const router = (0, express_1.Router)();
router.get("/", (req, res) => {
    res.send(types_1.comments);
});
router.post("/comments", (req, res) => {
    //this is so so sooo cool. Next step: fix types and make image keys not required
    types_1.comments.push({
        content: "new content",
        createdAt: String(Date.now()),
        replies: [],
        id: Number((0, uuidv4_1.uuid)()),
        score: Number((0, uuidv4_1.uuid)()),
        user: { image: { png: "hello", webp: "webp" }, username: "pippo" },
    });
    res.send({ comments: types_1.comments });
});
exports.default = router;
