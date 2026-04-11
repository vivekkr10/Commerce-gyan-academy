import express from "express";
import connectDB from "./src/config/db.js";
import { config } from "./src/config/env.js";
import userRoutes from "./src/routes/user.routes.js";
import studentRoutes from "./src/routes/student.routes.js";
import teacherRoutes from "./src/routes/teacher.routes.js";

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/api", userRoutes);
app.use("/api", studentRoutes);
app.use("/api", teacherRoutes);

const startServer = async () => {
  await connectDB();

  app.listen(config.PORT, () => {
    console.log(`Server is running on http://localhost:${config.PORT}`);
  });
};

startServer();
