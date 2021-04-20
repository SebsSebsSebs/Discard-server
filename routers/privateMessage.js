const router = require("express").Router();
const PrivateMessage = require("../models/privateMessageModel");
const PrivateServer = require("../models/privateServerModel");

router.post("/:privateServerId", async (req, res) => {
  try {
    const privateServerId = req.params.privateServerId;
    const { text, isImg } = req.body;

    const existServer = await PrivateServer.findOne({ _id: privateServerId });

    if (!existServer)
      return res.status(400).json({
        errorMessage: "No server soz",
      });

    if (!text) {
      res.status(422).json({ error: "please add required input" });
    }

    req.user.password = undefined;
    const message = new PrivateMessage({
      text,
      privateServerId,
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
router.get("/:privateServerId", async (req, res) => {
  try {
    const privateServerId = req.params.privateServerId;
    const findMessage = await PrivateMessage.find({ privateServerId })
      .populate("privateServerId", "privateServerName")
      .populate("userId", "username")
      .sort("-createdAt");

    res.json(findMessage);
  } catch (err) {
    res.status(500).send();
  }
});

module.exports = router;
