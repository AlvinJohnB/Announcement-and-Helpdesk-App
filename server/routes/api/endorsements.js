const express = require("express");
const router = express.Router();
const helpdeskController = require("../../controllers/endorsementController");
const auth = require("../../middleware/auth");

// Get all tickets
router.get("/", auth, helpdeskController.getTickets);
// Create ticket
router.post("/", auth, helpdeskController.createTicket);
// Close ticket
router.put("/:id/close", auth, helpdeskController.closeTicket);
// Re-open ticket
router.put("/:id/reopen", auth, helpdeskController.reopenTicket);
// Update ticket
router.put("/:id", auth, helpdeskController.updateTicket);
// Delete ticket
router.delete("/:id", auth, helpdeskController.deleteTicket);
// Add comment
router.post("/:id/comments", auth, helpdeskController.addComment);
// Get comments
router.get("/:id/comments", auth, helpdeskController.getComments);

module.exports = router;
