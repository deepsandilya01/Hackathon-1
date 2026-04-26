import notificationModel from "../models/notification.model.js";

/**
 * GET MY NOTIFICATIONS
 */
export async function getMyNotifications(req, res) {
  try {
    const notifications = await notificationModel
      .find({ recipient: req.user.id })
      .populate("incident")
      .sort({ createdAt: -1 });

    res.json({ success: true, message: "Fetched notifications", data: notifications });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

/**
 * MARK AS READ
 */
export async function markAsRead(req, res) {
  try {
    const { id } = req.params;

    const notification = await notificationModel.findOne({
      _id: id,
      recipient: req.user.id,
    });

    if (!notification) {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }

    notification.isRead = true;
    await notification.save();

    res.json({ success: true, message: "Marked as read", data: notification });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

/**
 * MARK ALL AS READ
 */
export async function markAllAsRead(req, res) {
  try {
    await notificationModel.updateMany(
      { recipient: req.user.id, isRead: false },
      { $set: { isRead: true } }
    );

    res.json({ success: true, message: "Marked all as read", data: null });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}
