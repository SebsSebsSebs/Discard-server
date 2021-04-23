const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const auth = require("./middleware/auth");
const Message = require("./models/messageModel");


dotenv.config();

//set up expess server
PORT = 4000;
const app = express();

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
// set up http only cookie
app.use(cookieParser());
app.use(express.json());

//router set up

app.use("/user", require("./routers/user"));
app.use("/message", auth, require("./routers/message"));
app.use("/channel", auth, require("./routers/channel"));
app.use("/server", auth, require("./routers/server"));
app.use("/privateserver", auth, require("./routers/privateServer"));
app.use("/privatemessage", auth, require("./routers/privateMessage"));

mongoose.connect(
  process.env.DB_CONNECT_STRING,
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false },
  (err) => {
    if (err) return console.error(err);
    console.log("Connected to mongoDB");
  }
);

//test 

const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("user connected");
  socket.on("Input chat message", async (msgData) => {
    console.log(msgData);

    const message = new Message({
      text: msgData.text,
      channelId: msgData.channelId,
      isImg: msgData.isImg,
      userId: msgData.userId,
    });
    console.log(message);
    await message.save();
    console.log(message._id);

    io.emit("Output chat message", { ...msgData, _id: message._id });
  });
  socket.on("Delete chat message", async (msgId) => {
    console.log(msgId);
    const messageId = msgId.messageId;
    const existingMessage = await Message.findByIdAndDelete({ _id: messageId });
    io.emit("Done deleting chat message", "true");
  });
  socket.on("Delete", async (msgId) => {
    console.log(msgId);
    const messageId = msgId.messageId;
    await Message.findByIdAndDelete({ _id: messageId });
    io.emit("Done deleting", msgId.index);
  });
}); //data coming from client

server.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
