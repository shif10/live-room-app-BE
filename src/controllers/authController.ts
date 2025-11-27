import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import User from "../models/User";


const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const GoogleLogin = async (req, res) => {
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


    let user = await User.findOne({ email });


    if (!user) {
        user = await User.create({
        name,
        email,
        avatar: picture,
      });
    }

   
    const jwtToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
        message: "Login successful",
      token: jwtToken,
      user: user,
    });

  } catch (error) {
    console.error("Google Login Error:", error);
    res.status(401).json({ message: "Invalid Google Token" });
  }
};
