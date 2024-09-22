const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');  // Assuming you have an authentication middleware
const Interaction = require('../models/interaction.model');  // Assuming you have an Interaction model
const Book = require('../models/work.model');  // Assuming you have a Book model

// GET all interactions for a user
router.get('/', auth, async (req, res) => {
    try {
        const interactions = await Interaction.find({ userId: req.user.userId }).populate('bookId');
        res.json(interactions);
    } catch (error) {
        res.status(500).json({ message: "Error fetching interactions", error: error.message });
    }
});

// GET a specific interaction by book ID
router.get('/:bookId', auth, async (req, res) => {
    try {
        const interaction = await Interaction.findOne({ userId: req.user.userId, bookId: req.params.bookId }).populate('bookId');
        if (!interaction) {
            return res.status(404).json({ message: "Interaction not found" });
        }
        res.json(interaction);
    } catch (error) {
        res.status(500).json({ message: "Error fetching interaction", error: error.message });
    }
});

// POST to create a new interaction
router.post('/', auth, async (req, res) => {
    const { bookId, rating, dateStarted, dateFinished, review, hasRead } = req.body;

    try {
        // Check if the book exists
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        // Check if an interaction already exists
        const existingInteraction = await Interaction.findOne({ userId: req.user.userId, bookId });
        if (existingInteraction) {
            return res.status(400).json({ message: "Interaction already exists for this book" });
        }

        // Create a new interaction
        const interaction = new Interaction({
            userId: req.user.userId,
            bookId,
            rating: rating || null,
            dateStarted: dateStarted || null,
            dateFinished: dateFinished || null,
            review: review || "",
            hasRead: hasRead || false
        });

        await interaction.save();
        res.status(201).json(interaction);
    } catch (error) {
        res.status(500).json({ message: "Error creating interaction", error: error.message });
    }
});

module.exports = router;

// PATCH to update an existing interaction (rating, review, dates, etc.)
router.patch('/:bookId', auth, async (req, res) => {
    const { rating, dateStarted, dateFinished, review, hasRead} = req.body;
    try {
        // Find the interaction for the user and book
        let interaction = await Interaction.findOne({ userId: req.user.userId, bookId: req.params.bookId });
        if (!interaction) {
            // Create a new interaction
            interaction = new Interaction({
                userId: req.user.userId,
                bookId: req.params.bookId,
                rating: rating || null,
                dateStarted: dateStarted || null,
                dateFinished: dateFinished || null,
                review: review || "",
                hasRead: hasRead || false
            });
        }
        else{
            // Update the fields that were provided
            if (rating !== undefined) interaction.rating = rating;
            if (dateStarted) interaction.dateStarted = dateStarted;
            if (dateFinished) interaction.dateFinished = dateFinished;
            if (review) interaction.review = review;
            if (hasRead !== undefined) interaction.hasRead = hasRead;
        }

        await interaction.save();
        res.json(interaction);
    } catch (error) {
        res.status(500).json({ message: "Error updating interaction", error: error.message });
    }
});

module.exports = router;