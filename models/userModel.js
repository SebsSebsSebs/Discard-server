const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },

    username: { type: String, required: true },

    passwordHash: { type: String, required: true },

    server: [{ type: Object, ref: "server" }],
  },
  { timestamps: true }
);

const User = mongoose.model("user", userSchema);

module.exports = User;
