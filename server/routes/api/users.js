const express = require("express");
const router = express.Router();
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  registerUser,
  getCurrentUser,
} = require("../../controllers/userController");
const auth = require("../../middleware/auth");
const admin = require("../../middleware/admin");

// @route   GET api/users/me
// @desc    Get current user
// @access  Private
router.get("/me", auth, getCurrentUser);

// @route   POST api/users/register
// @desc    Register a new user
// @access  Public
router.post("/register", registerUser);

// @route   GET api/users
// @desc    Get all users
// @access  Admin only
router.get("/", [auth, admin], getUsers);

// @route   GET api/users/:id
// @desc    Get user by id
// @access  Admin only
router.get("/:id", [auth, admin], getUser);

// @route   POST api/users
// @desc    Create a new user
// @access  Admin only
router.post("/", [auth, admin], createUser);

// @route   PUT api/users/:id
// @desc    Update a user
// @access  Admin only
router.put("/:id", [auth, admin], updateUser);

// @route   DELETE api/users/:id
// @desc    Delete a user
// @access  Admin only
router.delete("/:id", [auth, admin], deleteUser);

// @route   POST api/users/login
// @desc    Login user
// @access  Public
router.post("/login", loginUser);

module.exports = router;
