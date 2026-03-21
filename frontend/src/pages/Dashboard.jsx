import React, { useEffect, useState } from "react";
import {
  getTasks,
  createTask,
  deleteTask,
  updateTask,
  getUserInfo,
} from "../services/api";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  // 🔹 Fetch tasks
  const fetchTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(data.tasks);
    } catch (err) {
      alert(err.message);
    }
  };

  // 🔹 Fetch user info
  const fetchUser = async () => {
    try {
      const data = await getUserInfo();
      setUser(data.user);
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
    } else {
      fetchTasks();
      fetchUser(); // ✅ important
    }
  }, []);

  // 🔹 Create task
  const handleCreate = async () => {
    try {
      await createTask({ title, description });
      setTitle("");
      setDescription("");
      fetchTasks();
    } catch (err) {
      alert(err.message);
    }
  };

  // 🔹 Delete
  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      fetchTasks();
    } catch (err) {
      alert(err.message);
    }
  };

  // 🔹 Edit
  const handleEdit = (task) => {
    setEditId(task._id);
    setEditTitle(task.title);
    setEditDescription(task.description);
  };

  // 🔹 Update
  const handleUpdate = async (id) => {
    try {
      await updateTask(id, {
        title: editTitle,
        description: editDescription,
      });
      setEditId(null);
      fetchTasks();
    } catch (err) {
      alert(err.message);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* 🔥 TOP BAR */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Dashboard</h2>

        <div className="flex items-center gap-4">
          {user && (
            <div className="bg-white px-4 py-2 rounded shadow flex items-center gap-2">
              {/* avatar */}
              <div className="bg-blue-500 text-white w-8 h-8 flex items-center justify-center rounded-full">
                {user.username.charAt(0).toUpperCase()}
              </div>

              <div>
                <p className="font-semibold text-sm">{user.username}</p>
                <p className="text-gray-500 text-xs">{user.role}</p>
              </div>
            </div>
          )}

          <button
            className="bg-red-500 text-white px-3 py-1 rounded"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </div>

      {/* 🔹 CREATE TASK */}
      <div className="bg-white p-4 rounded shadow mb-4">
        <h3 className="font-bold mb-2">Create Task</h3>

        <input
          className="border p-2 w-full mb-2 rounded"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          className="border p-2 w-full mb-2 rounded"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleCreate}
        >
          Add Task
        </button>
      </div>

      {/* 🔹 TASK LIST */}
      {tasks.map((task) => (
        <div key={task._id} className="bg-white p-4 rounded shadow mb-2">
          {editId === task._id ? (
            <>
              <input
                className="border p-2 w-full mb-2 rounded"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />

              <input
                className="border p-2 w-full mb-2 rounded"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
              />

              <button
                className="bg-green-500 text-white px-3 py-1 mr-2 rounded"
                onClick={() => handleUpdate(task._id)}
              >
                Save
              </button>

              <button
                className="bg-gray-400 text-white px-3 py-1 rounded"
                onClick={() => setEditId(null)}
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <h4 className="font-bold">{task.title}</h4>
              <p>{task.description}</p>

              <button
                className="bg-yellow-500 text-white px-3 py-1 mr-2 mt-2 rounded"
                onClick={() => handleEdit(task)}
              >
                Edit
              </button>

              <button
                className="bg-red-500 text-white px-3 py-1 mt-2 rounded"
                onClick={() => handleDelete(task._id)}
              >
                Delete
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
