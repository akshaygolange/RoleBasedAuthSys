const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

// Create a task
router.post("/", authMiddleware, createTask);

// Get all tasks (user-specific, admin can see all)
router.get("/", authMiddleware, getTasks);

// Update a task by ID
router.put("/:id", authMiddleware, updateTask);

// Delete a task by ID
router.delete("/:id", authMiddleware, deleteTask);

module.exports = router;