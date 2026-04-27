import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
import { sendEmail } from "../services/mail.service.js";
import redis from "../config/redis.js";

/**
 * REGISTER
 */
export async function register(req, res) {
  try {
    const { fullname, phone, email, password, role } = req.body;

    const existingUser = await userModel.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
        success: false,
      });
    }

    const user = await userModel.create({
      fullname,
      phone,
      email,
      password,
      role: role || "User",
      verified: false 
    });

    // Email verification token
    const token = jwt.sign({ email: user.email }, config.JWT_SECRET, {
      expiresIn: "1h",
    });

    try {
      // Send Email via Resend
      await sendEmail({
        to: email,
        subject: "Verify Your Email 🚀",
        html: `
          <h2>Hello ${fullname},</h2>
          <p>Welcome to <strong>Crisis Response System</strong></p>
          <p>Click below to verify your email:</p>
          <a href="https://hackathon-1-2wnx.onrender.com/api/auth/verify-email?token=${token}">
            Verify Email
          </a>
          <p>This link expires in 1 hour.</p>
        `,
      });
      
      res.status(201).json({
        message: "Registered successfully. Please check your email to verify your account.",
        success: true,
      });
    } catch (emailError) {
      console.error("Failed to send email:", emailError);
      // Even if email fails, we shouldn't throw a 500 if user was created.
      // But since they can't verify, we might want to auto-verify them or just return an error.
      // Let's delete the user so they can try again, or just return an error.
      await userModel.findByIdAndDelete(user._id);
      return res.status(500).json({
        message: "Failed to send verification email. Please ensure you are using a verified Resend domain.",
        success: false,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
}

/**
 * VERIFY EMAIL
 */
export async function verifyEmail(req, res) {
  try {
    const { token } = req.query;

    const decoded = jwt.verify(token, config.JWT_SECRET);

    const user = await userModel.findOne({ email: decoded.email });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
        success: false,
      });
    }

    if (user.verified) {
      return res.json({
        message: "Already verified",
        success: true,
      });
    }

    user.verified = true;
    await user.save();

    return res.send(`
      <h2>✅ Email Verified</h2>
      <a href="${config.FRONTEND_URL}/login">Login Now</a>
    `);
  } catch (err) {
    return res.status(400).json({
      message: "Invalid or expired token",
      success: false,
    });
  }
}

/**
 * LOGIN
 */
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
        success: false,
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
        success: false,
      });
    }

    if (!user.verified) {
      return res.status(400).json({
        message: "Verify email first",
        success: false,
      });
    }

    const token = jwt.sign({ id: user._id }, config.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      message: "Login successful",
      success: true,
      token, // Return token here
      user: userResponse,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
}

/**
 * GET ME
 */
export async function getMe(req, res) {
  const user = await userModel.findById(req.user.id).select("-password");

  res.json({
    success: true,
    user,
  });
}

/**
 * LOGOUT
 */
export async function logout(req, res) {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(400).json({
        message: "No token provided",
        success: false,
      });
    }

    try {
      const decoded = jwt.verify(token, config.JWT_SECRET);
      const expireTime = decoded.exp - Math.floor(Date.now() / 1000);

      // Add to Redis blocklist if token hasn't expired yet
      if (expireTime > 0) {
        await redis.set(`bl_${token}`, "blocked", "EX", expireTime);
      }
    } catch (err) {
      // Token might already be invalid/expired, just proceed to clear cookie
    }

    res.clearCookie("token");

    res.json({
      message: "Logout successful",
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
}
