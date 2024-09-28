"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const router_1 = __importDefault(require("./router"));
const app = (0, express_1.default)();
const port = 5001;
app.use((0, cors_1.default)()); //middleware to make sure that different ports can talk to each other
app.use((0, morgan_1.default)("dev")); //middleware for logging on dev (ex. GET)
app.use(express_1.default.json()); //middleware that allows a client to send us json
app.use(express_1.default.urlencoded({ extended: true })); //middleware that allows query string to be encoded and decoded, to be in an object rather than strings
app.use("/api", router_1.default); //this is used to create modular routes
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
