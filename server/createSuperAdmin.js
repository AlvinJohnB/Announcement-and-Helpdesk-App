const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

async function createSuperAdmin() {
  try {
    const superadminExists = await User.findOne({ role: "superadmin" });
    if (!superadminExists) {
      const password = process.env.SUPERADMIN_PASSWORD || "superadmin123";
      const hashedPassword = await bcrypt.hash(password, 10);
      await User.create({
        username: process.env.SUPERADMIN_USERNAME || "ALVINJOHNEB",
        password: hashedPassword,
        firstName: process.env.SUPERADMIN_FIRSTNAME || "Alvin John",
        lastName: process.env.SUPERADMIN_LASTNAME || "Bregana",
        role: "superadmin",
        department: process.env.SUPERADMIN_DEPARTMENT || "Laboratory",
        active: true,
        createdAt: new Date(),
      });
    }
  } catch (err) {
    console.error("Error creating superadmin:", err);
  }
}

module.exports = createSuperAdmin;
