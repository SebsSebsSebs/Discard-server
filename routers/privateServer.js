const router = require("express").Router();

const PrivateServer = require("../models/privateServerModel");

router.post("/", async (req, res) => {
  try {
    const { privateServerName } = req.body;

    const inputName = await PrivateServer.findOne({ privateServerName });
    if (inputName)
      return res.status(400).json({
        errorMessage: "naming error",
      });

    req.user.password = undefined;
    const privateServer = new PrivateServer({
      privateServerName,
      userId: req.user,
    });
    console.log("privateserver", privateServer);
    privateServer.save().then((result) => {
      res.json({ privateServer: result });
    });
  } catch (err) {
    res.status(500).send();
  }
});

//fetch all servers
router.get("/", async (req, res) => {
  try {
    const findPrivateServer = await PrivateServer.find().sort("-createdAt");

    res.json(findPrivateServer);
  } catch (err) {
    res.status(500).send();
  }
});

router.get("/", async (req, res) => {});

module.exports = router;
