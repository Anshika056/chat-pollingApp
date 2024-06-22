const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");
const { connectDB } = require("./data");
const { register } = require("./auth");
const { vote, getOverallVoteCounts } = require("./poll");
const poll = require("./models/Poll");
require('dotenv').config();
// Connect to MongoDB
connectDB();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

async function fetchPollData() {
  try {
    let pollData = await getOverallVoteCounts();
    return pollData;
  } catch (err) {
    console.error("Error while fetching poll data:", err);
  }
}

let chatMessages = [];
let users = new Set();

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("register", async (username, password) => {
    try {
      let data = { username, password };
      let user = await register(data);
      if (user.statusMessage === "Invalid credentials" || user.token === "") {
        socket.emit("usernameTaken", username);
      } else {
        users.add(username);
        socket.username = username;
        const pollData = await fetchPollData();
        socket.emit("registrationSuccess", username);
        io.emit("userJoined", username);
        io.emit("pollData", pollData);
        io.emit("chatMessages", chatMessages);
      }
    } catch (error) {
      console.error(error);
      socket.emit(
        "registrationError",
        "An error occurred during registration."
      );
    }
  });

  socket.on("vote", async (option) => {
    if (socket.username) {
      const data = { username: socket.username, option };
      let pollData = await vote(data);

      io.emit("pollData", pollData);
    }
  });

  socket.on("chatMessage", (messageData) => {
    if (socket.username) {
      const chatMessage = {
        username: socket.username,
        message: messageData.message,
      };
      chatMessages.push(chatMessage);
      io.emit("chatMessages", chatMessages);
    }
  });

  socket.on("typing", (isTyping) => {
    if (socket.username) {
      socket.broadcast.emit("typing", { username: socket.username, isTyping });
    }
  });

  socket.on("disconnect", () => {
    if (socket.username) {
      users.delete(socket.username);
      io.emit("userLeft", socket.username);
    }
    console.log("A user disconnected");
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
