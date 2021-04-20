const router = require("express").Router();
const User = require("../models/userModel");
const Server = require("../models/serverModel");

router.post("/", async (req, res) => {
  try {
    const { serverName } = req.body;

    if (!serverName) {
      res.status(422).json({ error: "please add required input" });
    }

    req.user.password = undefined;
    const server = new Server({
      serverName,
    });

    server.save().then((result) => {
      res.json({ server: result });
    });

    User.findByIdAndUpdate(
      req.user,
      {
        $push: { server: server }, //push ID of logged in user to array of user being followed
      },
      { new: true }
    ).then((result) => {
      res.json({ user: result });
    });
  } catch (err) {
    res.status(500).send();
  }
});

//fetch all posts
router.get("/", async (req, res) => {
  try {
    const findServer = await Server.find()
      .populate("channel")
      .sort("-createdAt");

    res.json(findServer);
  } catch (err) {
    res.status(500).send();
  }
});

module.exports = router;
