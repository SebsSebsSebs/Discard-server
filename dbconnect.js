const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
mongoose.Promise = require("bluebird");
const url = "mongodb://localhost:4000/message";
const connect = mongoose.connect(url, { useNewUrlParser: true });

module.exports = connect;
