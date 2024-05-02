const express = require('express');
const router = express.Router();
const Book = require('../models/Bookmodel'); // Make sure this path is correct

// Search books by title
router.get('/title', async (req, res) => {
    const { query } = req.query;
    if (!query) {
        return res.status(400).json({ message: "Query parameter is required for searching with title." });
    }
    try {
        const books = await Book.find({ $text: { $search: query } }, { score: { $meta: "textScore" } }).sort({ score: { $meta: "textScore" } });
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: "Error searching for books by title", error: error.message });
    }
});

// Search books by author
router.get('/author', async (req, res) => {
    const { query } = req.query;
    if (!query) {
        return res.status(400).json({ message: "Query parameter is required." });
    }
    try {
        const books = await Book.find({ $text: { $search: query } }, { score: { $meta: "textScore" } }).sort({ score: { $meta: "textScore" } });
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: "Error searching for books by author", error: error.message });
    }
});

module.exports = router;
