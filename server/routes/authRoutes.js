const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const poll = require("../models/Poll");
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

//login
router.post("/login", async (req, res) => {

  try {

    const { email, password } = req.body

    console.log(email, password)

    // FIND USER
    const user = await User.findOne({ email })

    console.log(user)

    // CHECK USER
    if (!user) {

      return res.status(400).json({

        success: false,

        message: "Invalid credentials"

      })
    }

    // CHECK PASSWORD
    const isMatch = await bcrypt.compare(

      password,

      user.password

    )

    console.log(isMatch)

    if (!isMatch) {

      return res.status(400).json({

        success: false,

        message: "Invalid credentials"

      })
    }

    // CREATE TOKEN
    const token = jwt.sign(

      {
        id: user._id
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "7d"
      }

    )

    // SUCCESS RESPONSE
    res.status(200).json({

      success: true,

      token

    })

  } catch (error) {

    console.log(error)

    res.status(500).json({

      success: false,

      message: error.message

    })
  }
})

router.post("/google", async (req, res) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: req.body.token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { email, name, picture, sub: googleId } = ticket.getPayload();

    // Find existing user or create new one
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name,
        email,
        googleId,
        password: "google-oauth", // placeholder since password is required
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({ token, user: { name, email } });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
});
module.exports = router;
