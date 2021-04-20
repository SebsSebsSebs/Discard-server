const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const privateServerSchema = new mongoose.Schema(
  {
    userId: { type: ObjectId, ref: "user", required: true },
  },
  { timestamps: true }
);

const privateServer = mongoose.model("privateServer", privateServerSchema);

module.exports = privateServer;
