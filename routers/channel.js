const router = require("express").Router();
const Channel = require("../models/channelModel");
const Server = require("../models/serverModel");

router.post("/", async (req, res) => {
  try {
    const { channelName } = req.body;

    if (!channelName) {
      res.status(422).json({ error: "please add required input" });
    }

    req.user.password = undefined;
    const channel = new Channel({
      channelName,
    });
    channel.save().then((result) => {
      res.json({ channel: result });
    });
  } catch (err) {
    res.status(500).send();
  }
});

//fetch all channels
router.get("/", async (req, res) => {
  try {
    const findChannel = await Channel.find().sort("-createdAt");

    res.json(findChannel);
  } catch (err) {
    res.status(500).send();
  }
});

module.exports = router;
