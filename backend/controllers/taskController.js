const Task = require("../models/Task");

// 1️⃣ Create Task
const createTask = async (req, res) => {
  try {
    const { title, description } = req.body;

    const task = new Task({
      title,
      description,
      userId: req.userInfo.userId, // link task to logged-in user
    });

    await task.save();

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      task,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error creating task" });
  }
};

// 2️⃣ Get All Tasks (user-specific, admin can see all)
const getTasks = async (req, res) => {
  try {
    let tasks;
    if (req.userInfo.role === "admin") {
      tasks = await Task.find().populate("userId", "username email");
    } else {
      tasks = await Task.find({ userId: req.userInfo.userId });
    }

    res.status(200).json({ success: true, tasks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error fetching tasks" });
  }
};

// 3️⃣ Update Task
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    // Ownership/Admin check
    if (task.userId.toString() !== req.userInfo.userId && req.userInfo.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    // Update fields
    task.title = req.body.title || task.title;
    task.description = req.body.description || task.description;
    task.status = req.body.status || task.status;

    // Save safely
    await task.save();  // Works fine in Mongoose 7+

    res.status(200).json({ success: true, message: "Task updated successfully", task });
  } catch (err) {
    console.error("Update Task Error:", err);
    res.status(500).json({ success: false, message: "Error updating task", error: err.message });
  }
};

// 4️⃣ Delete Task
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    // Ownership/Admin check
    if (task.userId.toString() !== req.userInfo.userId && req.userInfo.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    // Delete task safely
    await task.deleteOne();  // <-- fixed here

    res.status(200).json({ success: true, message: "Task deleted successfully" });
  } catch (err) {
    console.error("Delete Task Error:", err);
    res.status(500).json({ success: false, message: "Error deleting task", error: err.message });
  }
};

module.exports = { createTask, getTasks, updateTask, deleteTask };