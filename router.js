"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const types_1 = require("./types");
const router = (0, express_1.Router)();
router.get("/", (req, res) => {
    res.send(types_1.comments);
});
exports.default = router;
