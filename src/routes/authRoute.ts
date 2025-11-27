import express from "express";
import { GoogleLogin } from "../controllers/authController";
import { authMiddleWare } from "../middleWare/auth.middleware";

const router = express.Router();

router.post("/login", GoogleLogin);

router.get("/me", authMiddleWare, async (req, res) => {
  // @ts-ignore
  res.json({ user: req.user });
});
export default router;
