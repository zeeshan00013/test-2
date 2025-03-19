const express = require("express");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("User already exists:", email);
      return res.status(400).json({ success: false }); // Send success as false
    }

    const newUser = new User({ username, email, password });
    await newUser.save();
    console.log("User saved:", newUser);

    res.status(201).json({ success: true }); // Send success as true
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ success: false }); // Send success as false
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found for email:", email);
      return res.status(400).json({ success: false }); // Send success as false
    }

    console.log("Entered Password:", password);
    console.log("Stored Hashed Password:", user.password);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password comparison result:", isMatch);

    if (!isMatch) {
      console.log("Password mismatch");
      return res.status(401).json({ success: false }); // Send success as false
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log("Login successful, token generated:", token);
    res.json({ success: true, token }); // Send token if login is successful
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ success: false }); // Send success as false
  }
});

module.exports = router;
