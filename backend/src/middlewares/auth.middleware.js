import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { config } from "../config/env.js";

const protect = async (req, res, next) => {
  try {
    let token = req.headers.authorization;

    if (!token || !token.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    token = token.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, config.JWT_SECRET);

    // Populate req.user with the actual user document
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("JWT Auth Error:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default protect;
