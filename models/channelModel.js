const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const channelSchema = new mongoose.Schema(
  {
    channelName: { type: String, required: true },
    // serverId: { type: ObjectId, ref: "server" },
  },
  { timestamps: true }
);

const Channel = mongoose.model("channel", channelSchema);

module.exports = Channel;
