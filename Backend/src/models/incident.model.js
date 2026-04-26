import mongoose from "mongoose";

const incidentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, enum: ["Fire", "Medical", "Security", "Natural Disaster", "Other"] },
    severity: { type: String, enum: ["Low", "Medium", "High", "Critical"] },
    status: { type: String, enum: ["Pending", "Active", "Resolved"], default: "Pending" },
    location: { type: String, required: true },
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    resolvedAt: { type: Date },
    aiDetected: { type: Boolean, default: true },
    isFake: { type: Boolean, default: false },
    confidenceScore: { type: Number, default: 100 },
    suggestedActions: [{ type: String }],
  },
  { timestamps: true }
);

const incidentModel = mongoose.model("Incident", incidentSchema);
export default incidentModel;
