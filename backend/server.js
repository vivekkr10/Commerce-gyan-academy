import express from "express";
import connectDB from "./src/config/db.js";
import { config } from "./src/config/env.js";
import userRoutes from "./src/routes/user.routes.js";

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);

const startServer = async () => {
  await connectDB();

  app.listen(config.PORT, () => {
    console.log(`Server is running on http://localhost:${config.PORT}`);
  });
};

startServer();