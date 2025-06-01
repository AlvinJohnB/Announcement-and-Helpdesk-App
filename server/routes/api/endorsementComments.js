const express = require("express");
const router = express.Router({ mergeParams: true });
const Endorsement = require("../../models/Endorsement");
const auth = require("../../middleware/auth");

// Add a comment to an endorsement
router.post("/:id/comments", auth, async (req, res) => {
  try {
    const endorsement = await Endorsement.findById(req.params.id);
    if (!endorsement)
      return res.status(404).json({ msg: "Endorsement not found" });
    const { content } = req.body;
    if (!content || !content.trim())
      return res.status(400).json({ msg: "Comment content required" });
    const comment = {
      userId: req.user.id,
      userName: req.user.firstName + " " + req.user.lastName,
      department: req.user.department,
      content,
      createdAt: new Date(),
    };
    endorsement.comments.unshift(comment);
    await endorsement.save();
    res.status(201).json(endorsement.comments);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Get comments for an endorsement
router.get("/:id/comments", auth, async (req, res) => {
  try {
    const endorsement = await Endorsement.findById(req.params.id);
    if (!endorsement)
      return res.status(404).json({ msg: "Endorsement not found" });
    res.json(endorsement.comments);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Edit a comment on an endorsement
router.put("/:id/comments/:commentId", auth, async (req, res) => {
  try {
    const endorsement = await Endorsement.findById(req.params.id);
    if (!endorsement)
      return res.status(404).json({ msg: "Endorsement not found" });
    const comment = endorsement.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ msg: "Comment not found" });
    // Only the commenter (by userId) or superadmin can edit
    if (
      comment.userId.toString() !== req.user.id &&
      req.user.role !== "superadmin"
    ) {
      return res
        .status(403)
        .json({ msg: "Not authorized to edit this comment" });
    }
    if (!req.body.content || !req.body.content.trim()) {
      return res.status(400).json({ msg: "Content required" });
    }
    // Save edit history
    if (!comment.editHistory) comment.editHistory = [];
    comment.editHistory.push({
      content: comment.content,
      editedAt: comment.editedAt || comment.createdAt || new Date(),
    });
    comment.content = req.body.content;
    comment.edited = true;
    comment.editedAt = new Date();
    await endorsement.save();
    res.json(comment);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
