import jwt from "jsonwebtoken";
import redis from "../config/redis.js";

export async function authUser(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized",
      success: false,
      err: "No token provided",
    });
  }

  try {
    // Check if token is in Redis blocklist
    const isBlocked = await redis.get(`bl_${token}`);
    if (isBlocked) {
      return res.status(401).json({
        message: "Unauthorized",
        success: false,
        err: "Token has been invalidated (Logged out)",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({
      message: "Unauthorized",
      success: false,
      err: "Invalid token",
    });
  }
}
