import connectDB from "./src/config/db.js";
import { config } from "./src/config/env.js";

const startServer = async () => {
  await connectDB();

  console.log(`Server is running on http://localhost:${config.PORT}`);
//   app.listen(PORT, () => {
//   });
};

startServer();
