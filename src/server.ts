import app from "./app";
import * as socketio from "socket.io";

/**
 * Start Express server.
 */
const server = app.listen(app.get("port"), () => {
  console.log("Successfully running");
});
// server.headersTimeout = 0;
// server.keepAliveTimeout = 0;

// setInterval(() => {
//     server.getConnections((err, connections) => {
//         // logger.info(`${connections} connections currently open`);
//     });
// }, 10000);

process.on("SIGTERM", shutDown);
process.on("SIGINT", shutDown);

let connections: any = [];

server.on("connection", (connection) => {
  connections.push(connection);
  connection.on(
    "close",
    () => (connections = connections.filter((curr: any) => curr !== connection))
  );
});

const io = new socketio.Server(server);
//Whenever someone connects this gets executed
io.on("connection", function (socket) {
  console.log("a user connected");

  //Whenever someone disconnects this piece of code executed
  socket.on("disconnect", function () {
    console.log("a user disconnected");
  });
});

/**
 * Shutdown express server gracefully.
 */
function shutDown() {
  server.close(() => {
    process.exit(0);
  });

  setTimeout(() => {
    process.exit(1);
  }, 10000);

  connections.forEach((curr: any) => curr.end());
  setTimeout(() => connections.forEach((curr: any) => curr.destroy()), 5000);
}

export default server;
