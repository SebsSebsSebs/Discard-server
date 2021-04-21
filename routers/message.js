const router = require("express").Router();
const Message = require("../models/messageModel");
const Channel = require("../models/channelModel");

router.post("/", async (req, res) => {
  try {
    const channelId = req.params.channelId;
    const { text, isImg } = req.body;

    const existChannel = await Channel.findOne({ _id: channelId });
    console.log("channel", existChannel);
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

//fetch all messages
router.get("/", async (req, res) => {
  try {
    const findMessage = await Message.find()
      .populate("channelId", "channelName")
      .sort("-createdAt");

    res.json(findMessage);
  } catch (err) {
    res.status(500).send();
  }
});

//fetch all messages by channel id => for Pim
router.get("/:channelId", async (req, res) => {
  try {
    const channelId = req.params.channelId;
    const findMessage = await Message.find({ channelId })
      .populate("channelId", "channelName")
      .populate("userId", "username")
      .sort("-createdAt");

    res.json(findMessage);
  } catch (err) {
    res.status(500).send();
  }
});

module.exports = router;
