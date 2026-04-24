import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
import { sendEmail } from "../services/mail.service.js";

/**
 * REGISTER
 */
export async function register(req, res) {
  try {
    const { fullname, phone, email, password } = req.body;

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
    });

    // Email verification token
    const token = jwt.sign({ email: user.email }, config.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Send Email via Resend
    await sendEmail({
      to: email,
      subject: "Verify Your Email 🚀",
      html: `
        <h2>Hello ${fullname},</h2>
        <p>Welcome to <strong>Your Project</strong></p>
        <p>Click below to verify your email:</p>
        <a href="http://localhost:3000/api/auth/verify-email?token=${token}">
          Verify Email
        </a>
        <p>This link expires in 1 hour.</p>
      `,
    });

    res.status(201).json({
      message: "Registered successfully. Check email.",
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
      <a href="http://localhost:3000/api/auth/login">Login Now</a>
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
      secure: false,
    });

    res.json({
      message: "Login successful",
      success: true,
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
