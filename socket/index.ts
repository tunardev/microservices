import "dotenv/config";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import axios from "axios";
import ServerSocket from "./src/socket";

const server = createServer();
const io = new Server(server, {
  path: "/socket",
  cors: {
    origin: "*",
    credentials: true,
  },
});

io.use(async (socket: Socket, next) => {
  if (!socket.handshake.query || !socket.handshake.query.token) {
    return next(new Error("Authentication error"));
  }

  axios.get("http://localhost:5000/api/@me", {}).then(({ data }) => {
      (socket as any).user = data.user;
      next();
  })
  .catch(() => {
      next(new Error("Authentication error"));
  });
})

io.on("connection", ServerSocket);

server.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});
