"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleLogin = void 0;
const { OAuth2Client } = require("google-auth-library");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const GoogleLogin = async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) {
            return res.status(400).json({ message: "Token is required" });
        }
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const { email, name, picture } = payload;
        let user = await User_1.default.findOne({ email });
        if (!user) {
            user = await User_1.default.create({
                name,
                email,
                avatar: picture,
            });
        }
        const jwtToken = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.json({
            message: "Login successful",
            token: jwtToken,
            user: user,
        });
    }
    catch (error) {
        console.error("Google Login Error:", error);
        res.status(401).json({ message: "Invalid Google Token" });
    }
};
exports.GoogleLogin = GoogleLogin;
