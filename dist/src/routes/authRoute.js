"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const auth_middleware_1 = require("../middleWare/auth.middleware");
const router = express_1.default.Router();
router.post("/login", authController_1.GoogleLogin);
router.get("/me", auth_middleware_1.authMiddleWare, async (req, res) => {
    // @ts-ignore
    res.json({ user: req.user });
});
exports.default = router;
