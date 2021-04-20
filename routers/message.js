const router = require("express").Router();
const Message = require("../models/messageModel");
const Channel = require("../models/channelModel");

router.post("/:channelId", async (req, res) => {
  try {
    const channelId = req.params.channelId;
    const { text, isImg } = req.body;

    const existChannel = await Channel.findOne({ channelId });
    if (!existChannel)
      return res.status(400).json({
        errorMessage: "No channel soz",
      });

    if (!text) {
      res.status(422).json({ error: "please add required input" });
    }

    req.user.password = undefined;
    const message = new Message({
      text,
      channelId,
      isImg,
      userId: req.user,
    });
    message.save().then((result) => {
      res.json({ message: result });
    });
  } catch (err) {
    res.status(500).send();
  }
});

module.exports = router;
