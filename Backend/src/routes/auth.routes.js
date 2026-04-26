import { Router } from "express";
import {
  registerValidator,
  loginValidator,
} from "../validators/auth.validator.js";

import { register, verifyEmail ,login ,getMe, logout} from "../controllers/auth.controller.js";
import { authUser } from "../middleware/auth.middleware.js";

const authRouter = Router();

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 * @body { fullname,phone number, email, password }
 */
authRouter.post("/register", registerValidator, register);

/**
 * @route GET /api/auth/verify-email
 * @desc Verify user email from token link
 * @access Public
 * @query { token }
 */
authRouter.get("/verify-email", verifyEmail);

/**
 * @route POST /api/auth/login
 * @desc Login user and return JWT token
 * @access Public
 * @body { email, password }
 */
authRouter.post("/login", loginValidator, login);

/**
 * @route GET /api/auth/get-me
 * @desc Get current logged in user's details
 * @access Private
 */
authRouter.get("/get-me",authUser, getMe);

/**
 * @route POST /api/auth/logout
 * @desc Logout user (Blocklist token in Redis)
 * @access Private
 */
authRouter.post("/logout", authUser, logout);

export default authRouter;
