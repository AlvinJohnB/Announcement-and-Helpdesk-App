const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const bodyParser = require("body-parser");
const path = require("path");

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Create superadmin user if not exists
const createSuperAdmin = require("./createSuperAdmin");
createSuperAdmin();

const app = express();

// Init Middleware
app.use(cors());
app.use(express.json({ extended: false }));
app.use(bodyParser.json());

// Define Routes
app.use("/api/endorsements", require("./routes/api/endorsements"));
app.use("/api/endorsements", require("./routes/api/endorsementComments"));
app.use("/api/announcements", require("./routes/api/announcements"));
app.use("/api/users", require("./routes/api/users"));
app.use("/api/qctests", require("./routes/api/qcTests"));

// Serve static files from client/build in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in on port ${PORT}`);
});
