const QCTest = require('../models/QCTest');

exports.getAllQCTests = async (req, res) => {
  try {
    const tests = await QCTest.find().sort({ createdAt: -1 });
    res.json(tests);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.createQCTest = async (req, res) => {
  try {
    const { name, status, remaining, section, remarks, _id } = req.body;
    let test;
    if (_id) {
      // Update existing test by _id
      test = await QCTest.findByIdAndUpdate(
        _id,
        { name, status, remaining, section, remarks },
        { new: true }
      );
      return res.status(200).json(test);
    } else {
      // Create new test
      test = new QCTest({ name, status, remaining, section, remarks });
      await test.save();
      return res.status(201).json(test);
    }
  } catch (err) {
    res.status(400).json({ error: 'Invalid data' });
  }
};

exports.deleteQCTest = async (req, res) => {
  try {
    await QCTest.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
