const Announcement = require("../models/Announcement");
const User = require("../models/User");

// Get all announcements
exports.getAnnouncements = async (req, res) => {
  try {
    // Get archived status from query params
    const showArchived = req.query.archived === "true";

    const announcements = await Announcement.find({ isArchived: showArchived })
      .populate("authorId", "firstName lastName department")
      .sort({ createdAt: -1 });
    res.json(announcements);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

// Get single announcement
exports.getAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id)
      .populate("authorId", "firstName lastName department")
      .populate("comments.userId", "firstName lastName department");

    if (!announcement) {
      return res.status(404).json({ msg: "Announcement not found" });
    }
    res.json(announcement);
  } catch (error) {
    console.error(error.message);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ msg: "Announcement not found" });
    }
    res.status(500).send("Server Error");
  }
};

// Create new announcement
exports.createAnnouncement = async (req, res) => {
  try {
    const { title, content, department } = req.body;
    const user = await User.findById(req.user.id).select("-password");

    const newAnnouncement = new Announcement({
      title,
      content,
      authorId: user._id,
      department,
      author: `${user.firstName} ${user.lastName}`, // Keep for backward compatibility
    });

    const announcement = await newAnnouncement.save();
    await announcement.populate("authorId", "firstName lastName department");

    res.json(announcement);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

// Comment on an announcement
exports.addComment = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) {
      return res.status(404).json({ msg: "Announcement not found" });
    }

    const user = await User.findById(req.user.id).select("-password");

    const newComment = {
      userId: user._id,
      userName: `${user.firstName} ${user.lastName}`,
      department: user.department,
      content: req.body.content,
    };

    announcement.comments.unshift(newComment);
    await announcement.save();
    await announcement.populate(
      "comments.userId",
      "firstName lastName department"
    );

    res.json(announcement);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

// Update announcement
exports.updateAnnouncement = async (req, res) => {
  try {
    const { title, content, department } = req.body;
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({ msg: "Announcement not found" });
    } // Check if user is authorized to edit
    const user = await User.findById(req.user.id);
    if (
      user.role !== "superadmin" &&
      announcement.authorId.toString() !== req.user.id &&
      (user.department !== announcement.department || user.role !== "admin")
    ) {
      return res
        .status(403)
        .json({ msg: "Not authorized to edit this announcement" });
    }

    // Update the announcement with new values
    if (title) announcement.title = title;
    if (content) announcement.content = content;
    if (department && user.role === "admin")
      announcement.department = department;

    await announcement.save();
    await announcement.populate("authorId", "firstName lastName department");
    await announcement.populate(
      "comments.userId",
      "firstName lastName department"
    );

    res.json(announcement);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

// Delete announcement
exports.deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) return res.status(404).json({ msg: "Not found" });
    // Only superadmin can delete archived announcements
    if (announcement.isArchived && req.user.role !== "superadmin") {
      return res.status(403).json({
        msg: "Only superadmin can delete archived announcements",
      });
    }
    // Only superadmin, author, or admin of department can delete non-archived
    if (
      req.user.role !== "superadmin" &&
      announcement.authorId.toString() !== req.user.id &&
      (req.user.department !== announcement.department ||
        req.user.role !== "admin")
    ) {
      return res.status(403).json({ msg: "Not authorized" });
    }
    await announcement.deleteOne();
    res.json({ msg: "Announcement deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// Archive/Unarchive announcement
exports.toggleArchiveAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    const user = await User.findById(req.user.id);

    if (!announcement) {
      return res.status(404).json({ msg: "Announcement not found" });
    } // Check if user is authorized to archive
    if (
      user.role !== "superadmin" &&
      user.role !== "it" &&
      !(user.role === "admin" && user.department === announcement.department)
    ) {
      return res
        .status(403)
        .json({ msg: "Not authorized to archive this announcement" });
    }

    // Toggle archive status
    announcement.isArchived = !announcement.isArchived;
    if (announcement.isArchived) {
      announcement.archivedBy = user._id;
      announcement.archivedAt = Date.now();
    } else {
      announcement.archivedBy = undefined;
      announcement.archivedAt = undefined;
    }

    await announcement.save();
    await announcement.populate("authorId", "firstName lastName department");
    await announcement.populate("archivedBy", "firstName lastName department");

    res.json(announcement);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};
