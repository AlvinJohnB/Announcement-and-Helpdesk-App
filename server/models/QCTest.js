const mongoose = require('mongoose');

const QCTestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  status: { type: String, required: true },
  remaining: { type: Number, default: null },
  createdAt: { type: Date, default: Date.now },
  section: { type: String, required: false },
  remarks: { type: String, default: "" }
});

module.exports = mongoose.model('QCTest', QCTestSchema);
