const HelpdeskTicket = require("../models/Endorsement");

exports.getTickets = async (req, res) => {
  try {
    const tickets = await HelpdeskTicket.find()
      .populate("closedBy", "firstName lastName username")
      .sort({ createdAt: -1 });
    // Attach closedByName for each ticket if closedBy is populated
    const ticketsWithNames = tickets.map((ticket) => {
      const t = ticket.toObject();
      if (t.closedBy && typeof t.closedBy === "object") {
        t.closedByName =
          t.closedBy.firstName && t.closedBy.lastName
            ? `${t.closedBy.firstName} ${t.closedBy.lastName}`.trim()
            : t.closedBy.username;
      }
      return t;
    });
    res.json(ticketsWithNames);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

exports.createTicket = async (req, res) => {
  try {
    const { subject, description, priority, department } = req.body;
    const ticket = new HelpdeskTicket({
      subject,
      description,
      priority,
      department,
      requester: req.user.id,
    });
    await ticket.save();
    res.status(201).json(ticket);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

exports.updateTicket = async (req, res) => {
  try {
    const ticket = await HelpdeskTicket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ msg: "Not found" });
    // Only requester, assignee, or admin can update
    if (
      req.user.role !== "superadmin" &&
      req.user.role !== "admin" &&
      ticket.requester.toString() !== req.user.id &&
      (!ticket.assignee || ticket.assignee.toString() !== req.user.id)
    ) {
      return res.status(403).json({ msg: "Not authorized" });
    }
    ticket.subject = req.body.subject || ticket.subject;
    ticket.description = req.body.description || ticket.description;
    ticket.priority = req.body.priority || ticket.priority;
    ticket.status = req.body.status || ticket.status;
    ticket.assignee = req.body.assignee || ticket.assignee;
    ticket.department = req.body.department || ticket.department;
    ticket.updatedAt = Date.now();
    await ticket.save();
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

exports.deleteTicket = async (req, res) => {
  try {
    const ticket = await HelpdeskTicket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ msg: "Not found" });
    // Only superadmin can delete closed tickets
    if (ticket.status === "closed" && req.user.role !== "superadmin") {
      return res
        .status(403)
        .json({ msg: "Only superadmin can delete closed tickets" });
    }
    // Only superadmin or requester can delete open/in-progress tickets
    if (
      req.user.role !== "superadmin" &&
      ticket.requester.toString() !== req.user.id
    ) {
      return res.status(403).json({ msg: "Not authorized" });
    }
    await ticket.deleteOne();
    res.json({ msg: "Ticket deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

exports.addComment = async (req, res) => {
  try {
    const ticket = await HelpdeskTicket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ msg: "Ticket not found" });
    const { content } = req.body;
    if (!content || !content.trim())
      return res.status(400).json({ msg: "Comment content required" });
    const comment = {
      userId: req.user.id,
      userName:
        req.user.firstName && req.user.lastName
          ? (req.user.firstName + " " + req.user.lastName).trim()
          : req.user.username,
      content,
      createdAt: new Date(),
    };
    ticket.comments.unshift(comment);
    await ticket.save();
    res.status(201).json(ticket.comments);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

exports.getComments = async (req, res) => {
  try {
    const ticket = await HelpdeskTicket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ msg: "Ticket not found" });
    res.json(ticket.comments);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

exports.closeTicket = async (req, res) => {
  try {
    const ticket = await HelpdeskTicket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ msg: "Ticket not found" });
    // Only superadmin or admin of the concern department can close
    if (
      req.user.role !== "superadmin" &&
      !(req.user.role === "admin" && req.user.department === ticket.department)
    ) {
      return res
        .status(403)
        .json({ msg: "Not authorized to close this ticket" });
    }
    const { reason } = req.body;
    if (!reason || !reason.trim()) {
      return res.status(400).json({ msg: "Reason for closing is required" });
    }
    ticket.status = "closed";
    ticket.closedBy = req.user._id;
    ticket.closedAt = new Date();
    ticket.closeReason = reason;
    ticket.updatedAt = new Date();
    await ticket.save();
    await ticket.populate({
      path: "closedBy",
      select: "firstName lastName username",
    });
    const ticketObj = ticket.toObject();
    if (ticket.closedBy) {
      ticketObj.closedByName =
        ticket.closedBy.firstName && ticket.closedBy.lastName
          ? `${ticket.closedBy.firstName} ${ticket.closedBy.lastName}`.trim()
          : ticket.closedBy.username;
    }
    res.json(ticketObj);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

exports.reopenTicket = async (req, res) => {
  try {
    const ticket = await HelpdeskTicket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ msg: "Ticket not found" });
    if (ticket.status !== "closed") {
      return res
        .status(400)
        .json({ msg: "Only closed tickets can be re-opened" });
    }
    // Only superadmin or admin of the concern department can re-open
    if (
      req.user.role !== "superadmin" &&
      !(req.user.role === "admin" && req.user.department === ticket.department)
    ) {
      return res
        .status(403)
        .json({ msg: "Not authorized to re-open this ticket" });
    }
    ticket.status = "open";
    ticket.updatedAt = Date.now();
    await ticket.save();
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};
