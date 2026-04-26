import { Router } from "express";
import {
  reportIncident,
  getMyIncidents,
  getIncidentById,
  getAllIncidents,
  updateIncidentStatus,
  getStaffDashboard,
  reportQuickIncident
} from "../controllers/incident.controller.js";
import { authUser } from "../middleware/auth.middleware.js";
import { validateIncidentReport } from "../validators/incident.validator.js";

import userModel from "../models/user.model.js";

const incidentRouter = Router();

// Staff check inline middleware
const isStaff = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user.id);
    if (!user || user.role !== "Staff") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    req.user.role = user.role;
    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * @route POST /api/incidents/report
 * @desc Create new incident
 * @access Private
 */
incidentRouter.post("/report", authUser, validateIncidentReport, reportIncident);

/**
 * @route POST /api/incidents/quick-report
 * @desc Create new incident from unstructured message
 * @access Private
 */
incidentRouter.post("/quick-report", authUser, reportQuickIncident);

/**
 * @route GET /api/incidents/my-incidents
 * @desc Get all incidents reported by logged in user
 * @access Private
 */
incidentRouter.get("/my-incidents", authUser, getMyIncidents);

/**
 * @route GET /api/incidents/dashboard
 * @desc Return counts: total, pending, active, resolved
 * @access Private/Staff
 */
incidentRouter.get("/dashboard", authUser, isStaff, getStaffDashboard);

/**
 * @route GET /api/incidents/all
 * @desc Get all incidents with filters (status, severity, type)
 * @access Private/Staff
 */
incidentRouter.get("/all", authUser, isStaff, getAllIncidents);

/**
 * @route GET /api/incidents/:id
 * @desc Get single incident by id (only if reported by user)
 * @access Private
 */
incidentRouter.get("/:id", authUser, getIncidentById);

/**
 * @route PATCH /api/incidents/:id/status
 * @desc Update status (Active/Resolved), set assignedTo, set resolvedAt
 * @access Private/Staff
 */
incidentRouter.patch("/:id/status", authUser, isStaff, updateIncidentStatus);

export default incidentRouter;
