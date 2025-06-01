const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  userName: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  edited: { type: Boolean, default: false },
  editedAt: { type: Date },
  editHistory: [
    {
      content: String,
      editedAt: Date,
    },
  ],
});

const HelpdeskTicketSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  description: { type: String, required: true },
  status: {
    type: String,
    enum: ["open", "in progress", "resolved", "closed"],
    default: "open",
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium",
  },
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  assignee: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  department: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  edited: { type: Boolean, default: false },
  editedAt: { type: Date },
  editHistory: [
    {
      subject: String,
      description: String,
      editedAt: Date,
      editedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
  ],
  comments: [commentSchema],
  closedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  closedAt: { type: Date },
  closeReason: { type: String },
});

module.exports = mongoose.model("HelpdeskTicket", HelpdeskTicketSchema);
