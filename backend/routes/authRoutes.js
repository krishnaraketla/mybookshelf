const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Make sure the path to your User model is correct

const router = express.Router();

// Environment variable for JWT_SECRET
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;

// Register new user
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required." });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }

        // Create and save the new user
        const user = new User({ username, password });
        await user.save();

        // Respond with success (optionally, you could also create a token here and send it back)
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error registering new user", error: error.message });
    }
});

// Login user
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required." });
        }

        // Check if user exists
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the password is correct
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid password" });
        }

        // Generate a token
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1d' });

        // Respond with token
        res.json({ message: "Login successful", token });
    } catch (error) {
        res.status(500).json({ message: "Error logging in", error: error.message });
    }
});

module.exports = router;
