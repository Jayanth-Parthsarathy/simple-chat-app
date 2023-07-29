const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
const users = [];

io.on("connection", (socket) => {
  users.push({ id: socket.id, name: "Anonymous" });
  socket.broadcast.emit("join", "A new user has joined the chat");
  socket.on("set nickname", (nickname) => {
    const userIndex = users.findIndex((user) => user.id === socket.id);
    if (userIndex !== -1) {
      users[userIndex].name = nickname;
    }
  });
  socket.on("chat message", (msg) => {
    const user = users.find((user) => user.id === socket.id);
    const message = `${user.name}: ${msg}`;
    socket.broadcast.emit("chat message", message);
  });
  socket.on("typing", () => {
    const user = users.find((user) => user.id === socket.id);
    socket.broadcast.emit("typing", user.name + " is typing...");
  });
});
server.listen(3000, () => {
  console.log("listening on *:3000");
});
