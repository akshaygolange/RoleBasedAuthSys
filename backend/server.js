require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const connectToDB = require("./database/db");
const authRoutes = require("./routes/authRoutes");
const homeRoutes = require("./routes/homeRoutes");
const adminRoutes = require("./routes/adminRoutes");
const taskRoutes = require("./routes/taskRoutes");
connectToDB();
const PORT = process.env.PORT || 3000;

app.use(express.json());
// app.use(cors());

// ---------- CORS CONFIGURATION ----------
const allowedOrigins = [
  "http://localhost:5173", // local frontend
  "https://role-based-auth-sys.vercel.app", // production frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // Postman, mobile apps
      if (allowedOrigins.indexOf(origin) === -1) {
        return callback(
          new Error("CORS policy does not allow access from this origin."),
          false,
        );
      }
      return callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // allow cookies/auth headers
  }),
);
// ----------------------------------------

app.get("/api/data", (req, res) => {
  res.json({
    message: "Hello node js!",
  });
});

//middlewares
// app.use(express.json());
// app.use(cors());
app.use("/api/auth", authRoutes);
app.use("/api/home", homeRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/tasks", taskRoutes);
app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
});
