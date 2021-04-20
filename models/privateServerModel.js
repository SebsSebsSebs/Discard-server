const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const privateServerSchema = new mongoose.Schema(
  {
    privateServerName: { type: String, required: true },
    userId: { type: ObjectId, ref: "user", required: true },
  },
  { timestamps: true }
);

const PrivateServer = mongoose.model("privateServer", privateServerSchema);

module.exports = PrivateServer;
