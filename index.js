import http from "http";
import app, { initializeServer } from "./starter.js";

const server = http.createServer(app);

const PORT = process.env.PORT || 3000;

server.listen(PORT, async () => {
  try {
    await initializeServer(PORT, server);
  } catch (error) {
    console.error("Server failed to start:", error);
  }
});
