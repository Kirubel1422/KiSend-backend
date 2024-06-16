require("dotenv").config();
const SECRET = process.env.SECRET;
const express = require("express");
const connectDB = require("./src/configs/db");
const helmet = require("helmet");
const cors = require("cors");
const passport = require("passport");
const socket = require("socket.io");
const authorize = require("./src/middlewares/auth.middleware");
require("./src/configs/passport")(passport);

const app = express();
const server = require("http").createServer(app);
const io = socket(server, {
  cors: {
    origin: "*",
    METHODS: ["GET", "POST"],
  },
});
const { authRouter } = require("./src/routes/auth.router");

// Establish connection with MongoDB
connectDB();

// Use Helmet and cors
app.use(helmet());
app.use(
  cors({
    origin: "*",
  })
);

// Socket.io
// io.on("connection", (socket) => {
//   console.log("connected");
//   socket.emit("message", "Hi");

//   socket.on("disconnect", () => {
//     console.log("disconnected");
//   });
// });

// Parse req.body
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());

// Routes
app.use("/auth", authRouter);

// Port
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server is listening on port: ${PORT}`));
