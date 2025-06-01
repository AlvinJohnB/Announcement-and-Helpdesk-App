const User = require("../models/User");

module.exports = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
      return res.status(403).json({ msg: "Access denied. Admin only." });
    }

    next();
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};
