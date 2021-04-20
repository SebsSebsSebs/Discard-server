const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const serverSchema = new mongoose.Schema(
  {
    serverName: { type: String, required: true },
  },
  { timestamps: true }
);

const Server = mongoose.model("server", serverSchema);

module.exports = Server;
