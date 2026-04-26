import { Router } from "express";
import { getMyNotifications, markAsRead, markAllAsRead } from "../controllers/notification.controller.js";
import { authUser } from "../middleware/auth.middleware.js";

const notificationRouter = Router();

/**
 * @route GET /api/notifications/
 * @desc Get all notifications for logged in user
 * @access Private
 */
notificationRouter.get("/", authUser, getMyNotifications);

/**
 * @route PATCH /api/notifications/read-all
 * @desc Mark all notifications as read
 * @access Private
 */
notificationRouter.patch("/read-all", authUser, markAllAsRead);

/**
 * @route PATCH /api/notifications/:id/read
 * @desc Mark single notification as read by id
 * @access Private
 */
notificationRouter.patch("/:id/read", authUser, markAsRead);

export default notificationRouter;
