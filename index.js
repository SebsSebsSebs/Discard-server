const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const auth = require("./middleware/auth");

dotenv.config();

//set up express server
PORT = 5000;
const app = express();

app.use(express.json());
//set up http only cookie
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(cookieParser());

app.listen(5000, () => console.log("server started on port => ", PORT));

//router set up

app.use("/user", require("./routers/user"));
app.use("/message", auth, require("./routers/message"));
app.use("/channel", auth, require("./routers/channel"));
app.use("/server", auth, require("./routers/server"));
app.use("/privateserver", auth, require("./routers/privateServer"));
app.use("/privatemessage", auth, require("./routers/privateMessage"));

//connect to mongoDB
mongoose.connect(
  process.env.DB_CONNECT_STRING,
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false },
  (err) => {
    if (err) return console.error(err);
    console.log("Connected to mongoDB");
  }
);

//socketIo
const server = require("http").createServer(app);
const io = require("socket.io")(server); //connecting client

io.on("connection", (socket) => {
  socket.on("Input chat message", (msgData) => {
    // 1. put our data in the database

    connect.then((db) => {
      try {
        const chat = new Chat({
          messsage: msgData.chatMessage,
          sender: msgData.userId,
          type: msgData.type,
        }); //create new Chat model and put data in the mongoDB

        chat.save((err, doc) => {
          if (err) {
            return res.json({ success: false, err });
          }

          Chat.find({ id: doc.id })
            .populate("sender")
            .exec((err, doc) => {
              return io.emit("Output chat message", doc); //sending the chat value to the client
            });
        });
      } catch (e) {
        console.error(e);
      }
    });
  });
}); //data coming from client

server.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
