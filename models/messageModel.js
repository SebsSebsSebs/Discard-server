const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const messageSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    isImg: { type: Boolean, required: true },
    userId: { type: ObjectId, ref: "user", required: true },
    channelId: { type: ObjectId, ref: "channel", required: true },
  },
  { timestamps: true }
);

const Message = mongoose.model("message", messageSchema);

module.exports = Message;
