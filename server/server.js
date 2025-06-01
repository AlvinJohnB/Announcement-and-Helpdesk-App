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

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static(path.join(__dirname, "../client/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
