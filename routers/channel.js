const router = require("express").Router();
const Channel = require("../models/channelModel");
const Server = require("../models/serverModel");

router.post("/:serverId", async (req, res) => {
  try {
    const serverId = req.params.serverId;
    const { channelName } = req.body;

    const existServer = await Server.findOne({ serverId });
    if (!existServer)
      return res.status(400).json({
        errorMessage: "No server soz",
      });

    if (!channelName) {
      res.status(422).json({ error: "please add required input" });
    }

    req.user.password = undefined;
    const channel = new Channel({
      channelName,
      serverId,
    });
    channel.save().then((result) => {
      res.json({ channel: result });
    });
  } catch (err) {
    res.status(500).send();
  }
});

module.exports = router;
