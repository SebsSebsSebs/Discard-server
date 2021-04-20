const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const privateMessagesSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    isImg: { type: Boolean, required: true },
    userId: { type: ObjectId, ref: "user", required: true },
    privateServerId: { type: ObjectId, ref: "privateServer", required: true },
  },
  { timestamps: true }
);

const PrivateMessages = mongoose.model("privateMessage", privateMessagesSchema);

module.exports = PrivateMessages;
