require("dotenv").config();
const express = require("express");
const { initSocket } = require("./sockets/socket");
const http = require("http");

const cors = require("cors");
const connectDB = require("./config/database");
const authRoutes = require("./routes/authRoutes");
const pollRoutes = require("./routes/pollRoutes");
const adminRoutes = require("./routes/admin");
const app = express();
const server = http.createServer(app);

initSocket(server);

app.use(cors());
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.send("API is running");
});

app.use("/api/auth", authRoutes);
app.use("/api/polls", pollRoutes);

app.use("/api/admin", adminRoutes);
app.use(
  cors({
    origin: ["http://localhost:5173", "https://poll-app-two-navy.vercel.app"],
    credentials: true,
  }),
);

const PORT = 8000;

server.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
