import express from "express";
import connectDB from "./src/config/db.js";
import { config } from "./src/config/env.js";
import userRoutes from "./src/routes/user.routes.js";
import studentRoutes from "./src/routes/student.routes.js";
import teacherRoutes from "./src/routes/teacher.routes.js";
import subjectRoutes from "./src/routes/subject.routes.js";
import classRoutes from "./src/routes/classes.routes.js";
import uploadsRoutes from "./src/routes/upload.routes.js";
import UploadHomework from "./src/routes/homework.routes.js"

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/api", userRoutes);
app.use("/api", studentRoutes);
app.use("/api", teacherRoutes);
app.use("/api", subjectRoutes);
app.use("/api", classRoutes);
app.use("/api", uploadsRoutes);
app.use("/api", UploadHomework);

const startServer = async () => {
  await connectDB();

  app.listen(config.PORT, () => {
    console.log(`Server is running on http://localhost:${config.PORT}`);
  });
};

app.use((err, req, res, next) => {
  console.log("💀 GLOBAL ERROR CAUGHT:");
  console.log(err);

  res.status(500).json({
    error: err.message || "Something went wrong",
    full: err,
  });
});

startServer();
