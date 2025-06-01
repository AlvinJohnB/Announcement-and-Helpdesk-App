const express = require("express");
const router = express.Router();
const {
  getAnnouncements,
  getAnnouncement,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  addComment,
  toggleArchiveAnnouncement,
} = require("../../controllers/announcementController");
const auth = require("../../middleware/auth");

// @route   GET api/announcements
// @desc    Get all announcements
// @access  Public
router.get("/", getAnnouncements);

// @route   GET api/announcements/:id
// @desc    Get single announcement
// @access  Public
router.get("/:id", getAnnouncement);

// @route   POST api/announcements
// @desc    Create a new announcement
// @access  Private
router.post("/", auth, createAnnouncement);

// @route   PUT api/announcements/:id
// @desc    Update an announcement
// @access  Private
router.put("/:id", auth, updateAnnouncement);

// @route   DELETE api/announcements/:id
// @desc    Delete an announcement
// @access  Private
router.delete("/:id", auth, deleteAnnouncement);

// @route   POST api/announcements/:id/comments
// @desc    Add a comment to an announcement
// @access  Private
router.post("/:id/comments", auth, addComment);

// @route   PUT api/announcements/:id/archive
// @desc    Archive/Unarchive an announcement
// @access  Private (IT or department admin)
router.put("/:id/archive", auth, toggleArchiveAnnouncement);

module.exports = router;
