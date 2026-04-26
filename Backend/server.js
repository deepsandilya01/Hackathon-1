import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);
dns.setDefaultResultOrder("ipv4first");

import app from "./src/app.js";
import { config } from "./src/config/config.js";
import connectDB from "./src/config/db.js";
import { createServer } from "http";
import { initSocket } from "./src/services/socket.service.js";

const PORT = config.PORT;

const startServer = async () => {
  try {
    await connectDB();
    const server = createServer(app);
    initSocket(server);
    server.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server: ", error.message);
    process.exit(1);
  }
};

startServer();
