import incidentModel from "../models/incident.model.js";
import notificationModel from "../models/notification.model.js";
import userModel from "../models/user.model.js";
import { analyzeIncident, analyzeQuickIncident } from "../services/ai.service.js";
import { getIO } from "../services/socket.service.js";

/**
 * REPORT INCIDENT
 */
export async function reportIncident(req, res) {
  try {
    const { title, description, location } = req.body;

    const { type, severity, isFake, confidenceScore, suggestedActions } = await analyzeIncident(title, description);

    const incident = await incidentModel.create({
      title,
      description,
      type,
      severity,
      location,
      reportedBy: req.user.id,
      aiDetected: true,
      isFake,
      confidenceScore,
      suggestedActions
    });

    const staffUsers = await userModel.find({ role: "Staff" });
    const fakeFlag = isFake ? " [⚠️ AI suspects fake]" : "";
    const notifications = staffUsers.map((staff) => ({
      recipient: staff._id,
      incident: incident._id,
      message: `🚨 New ${severity} ${type} incident${fakeFlag}: ${title} at ${location}`,
    }));

    if (notifications.length > 0) {
      await notificationModel.insertMany(notifications);
    }

    try {
      getIO().to("staff-room").emit("new-incident", {
        incident,
        message: "New incident reported",
      });
    } catch (e) {
      console.warn("Socket emission failed", e.message);
    }

    res.status(201).json({
      success: true,
      message: "Incident reported successfully",
      data: incident,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

/**
 * QUICK REPORT INCIDENT (Unstructured)
 */
export async function reportQuickIncident(req, res) {
  try {
    const { message } = req.body;
    if (!message || message.trim().length < 5) {
      return res.status(400).json({ success: false, message: "Message is too short or empty." });
    }

    const { title, location, type, severity, isFake, confidenceScore, suggestedActions } = await analyzeQuickIncident(message);

    const incident = await incidentModel.create({
      title,
      description: message, // Use the unstructured message as the description
      type,
      severity,
      location,
      reportedBy: req.user.id,
      aiDetected: true,
      isFake,
      confidenceScore,
      suggestedActions
    });

    const staffUsers = await userModel.find({ role: "Staff" });
    const fakeFlag = isFake ? " [⚠️ AI suspects fake]" : "";
    const notifications = staffUsers.map((staff) => ({
      recipient: staff._id,
      incident: incident._id,
      message: `🚨 Quick SOS ${severity} ${type}${fakeFlag}: ${title} at ${location}`,
    }));

    if (notifications.length > 0) {
      await notificationModel.insertMany(notifications);
    }

    try {
      getIO().to("staff-room").emit("new-incident", {
        incident,
        message: "New quick incident reported",
      });
    } catch (e) {
      console.warn("Socket emission failed", e.message);
    }

    res.status(201).json({
      success: true,
      message: "Quick Incident reported successfully",
      data: incident,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

/**
 * GET MY INCIDENTS
 */
export async function getMyIncidents(req, res) {
  try {
    const incidents = await incidentModel
      .find({ reportedBy: req.user.id })
      .populate("reportedBy", "fullname email")
      .populate("assignedTo", "fullname email")
      .sort({ createdAt: -1 });

    res.json({ success: true, message: "Fetched my incidents", data: incidents });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

/**
 * GET INCIDENT BY ID
 */
export async function getIncidentById(req, res) {
  try {
    const { id } = req.params;
    const incident = await incidentModel
      .findById(id)
      .populate("reportedBy", "fullname email")
      .populate("assignedTo", "fullname email");

    if (!incident) {
      return res.status(404).json({ success: false, message: "Incident not found" });
    }

    if (String(incident.reportedBy._id || incident.reportedBy) !== String(req.user.id)) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    res.json({ success: true, message: "Fetched incident", data: incident });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

/**
 * GET ALL INCIDENTS (STAFF)
 */
export async function getAllIncidents(req, res) {
  try {
    const { status, severity, type } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (severity) filter.severity = severity;
    if (type) filter.type = type;

    const incidents = await incidentModel
      .find(filter)
      .populate("reportedBy", "fullname email")
      .populate("assignedTo", "fullname email")
      .sort({ createdAt: -1 });

    res.json({ success: true, message: "Fetched incidents", data: incidents });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

/**
 * UPDATE INCIDENT STATUS (STAFF)
 */
export async function updateIncidentStatus(req, res) {
  try {
    const { id } = req.params;
    const { status, assignedTo } = req.body;

    const incident = await incidentModel.findById(id);

    if (!incident) {
      return res.status(404).json({ success: false, message: "Incident not found" });
    }

    if (status) incident.status = status;
    if (assignedTo) incident.assignedTo = assignedTo;

    if (status === "Resolved") {
      incident.resolvedAt = new Date();
    }

    await incident.save();

    const reportedById = String(incident.reportedBy._id || incident.reportedBy);

    try {
      getIO().to(reportedById).emit("incident-updated", {
        incidentId: incident._id,
        status: incident.status,
        message: `Your incident status updated to ${incident.status}`,
      });
    } catch (e) {
      console.warn("Socket emission failed", e.message);
    }

    await notificationModel.create({
      recipient: reportedById,
      incident: incident._id,
      message: `✅ Your incident '${incident.title}' status changed to ${incident.status}`,
    });

    res.json({ success: true, message: "Incident updated successfully", data: incident });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

/**
 * GET STAFF DASHBOARD (STAFF)
 */
export async function getStaffDashboard(req, res) {
  try {
    const total = await incidentModel.countDocuments();
    const pending = await incidentModel.countDocuments({ status: "Pending" });
    const active = await incidentModel.countDocuments({ status: "Active" });
    const resolved = await incidentModel.countDocuments({ status: "Resolved" });
    const critical = await incidentModel.countDocuments({ severity: "Critical" });

    const recentIncidents = await incidentModel
      .find()
      .populate("reportedBy", "fullname email")
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      message: "Fetched dashboard counts",
      data: {
        total,
        pending,
        active,
        resolved,
        critical,
        recentIncidents,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}
