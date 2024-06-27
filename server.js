require("dotenv").config();
const SECRET = process.env.SECRET;
const express = require("express");
const connectDB = require("./src/configs/db");
const helmet = require("helmet");
const cors = require("cors");
const passport = require("passport");
const socket = require("socket.io");
const fileUpload = require("express-fileupload");
const path = require("path");
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
const { userRouter } = require("./src/routes/user.router");
const { imageRouter } = require("./src/routes/image.router");

// Establish connection with MongoDB
connectDB();

// File upload
app.use(express.static(path.resolve(__dirname + "./public")));
app.use(
  fileUpload({
    limits: 5000 * 1024, // 5 mb
    abortOnLimit: true,
  })
);

// Use Helmet and cors
app.use(helmet());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PATCH"],
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
app.use("/image", imageRouter);
app.use("/api", authorize, userRouter);

// Port
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server is listening on port: ${PORT}`));
