const router = require("express").Router();
const User = require("../models/userModel");
const Server = require("../models/serverModel");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

//user signup
router.post("/signup", async (req, res) => {
  try {
    const { email, username, password, passwordVerify } = req.body;
    //validation
    if (!email || !username || !password || !passwordVerify)
      return res
        .status(400)
        .json({ errorMessage: "Please enter all required fields " });

    if (password.length < 6)
      return res.status(400).json({
        errorMessage: "Your password needs to longer than 6 characters ",
      });

    if (password !== passwordVerify)
      return res.status(400).json({
        errorMessage: "Your passwords do not match ",
      });

    //check user & email
    const existUser = await User.findOne({ email });
    console.log(existUser);
    if (existUser)
      return res.status(400).json({
        errorMessage: "email already in use ",
      });
    const existUsername = await User.findOne({ username });
    console.log(existUser);
    if (existUsername)
      return res.status(400).json({
        errorMessage: "username already in use ",
      });

    //hashpwd
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    console.log(passwordHash);

    //save user in db
    const newUser = new User({
      email,
      username,
      passwordHash,
    });

    const savedUser = await newUser.save();

    //JWT setup
    const token = jwt.sign(
      {
        id: savedUser._id,
      },
      process.env.JWT_SECRET
    );
    res.cookie("token", token, { httpOnly: true }).send();
  } catch (err) {
    res.status(500).send();
  }
});

//user login

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    //validation
    if (!email || !password)
      return res
        .status(400)
        .json({ errorMessage: "Please enter all required fields " });

    //get the user account
    const existUser = await User.findOne({ email });
    if (!existUser)
      return res.status(401).json({
        errorMessage: "Incorrect Email or Password",
      });

    //bcrypt comparing hash
    const passwordSuccess = await bcrypt.compare(
      password,
      existUser.passwordHash
    );

    if (!passwordSuccess)
      return res.status(401).json({
        errorMessage: "Incorrect Password",
      });

    //JWT setup
    const token = jwt.sign(
      {
        id: existUser._id,
      },
      process.env.JWT_SECRET
    );
    res.cookie("token", token, { httpOnly: true }).send();
  } catch (err) {
    res.status(500).send();
  }
});

router.get("/loggedIn", (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.json(null);
    const validatedUser = jwt.verify(token, process.env.JWT_SECRET);

    res.json(validatedUser.id);
  } catch (err) {
    return res.json(null);
  }
});

router.get("/logout", (req, res) => {
  try {
    res.clearCookie("token").send();
  } catch (err) {
    return res.json(null);
  }
});

// logged in user own profile posts
router.get("/myprofile", auth, async (req, res) => {
  try {
    const myProfile = await User.find({ _id: req.user });
    console.log("what is my profile", myProfile);
    res.json({ myProfile });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
