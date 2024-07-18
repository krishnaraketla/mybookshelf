const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const Shelf = require('../models/shelf.model');
require('dotenv').config();
const auth = require('../middleware/auth');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

router.post('/validate', auth, (req, res) => {
    res.status(200).json({ message: 'Token is valid' });
});

// Register new user
router.post('/register', async (req, res) => {
    try {
        console.log(req.body)
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
        const hashedPassword = await bcrypt.hash(password, 8);
        const user = new User({ username, password: hashedPassword });
        await user.save();

        // Create default shelves
        const shelves = ['tbr', 'reading', 'finished'];
        for (const shelfName of shelves) {
            const shelf = new Shelf({ name: shelfName, owner: user._id });
            await shelf.save();
            user.shelves.push(shelf._id);
        }

        await user.save(); // Save user with updated shelves

        // Generate a token
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1d' });

        // Respond with success and token
        res.status(201).json({ message: "User registered successfully", token });
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
            console.log('User not found:', username);
            return res.status(404).json({ message: "User not found" });
        }

        console.log('Stored Hashed Password:', user.password);  // Log the hashed password from the database
        console.log('Provided Password:', password);  
        // Check if the password is correct
        const isMatch = await bcrypt.compare(password, user.password);
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
