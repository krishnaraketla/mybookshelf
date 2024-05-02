const express = require("express");
const router = express.Router();

// Shelves Routes
// GET all shelves
router.get('/', (req, res) => {
    res.json({ message: "GET all shelves" });
});

// GET a single shelf
router.get('/:shelfId', (req, res) => {
    res.json({ message: "GET single shelf", shelfId: req.params.shelfId });
});

// Create a new shelf
router.post('/', (req, res) => {
    res.json({ message: "POST new shelf" });
});

// Update a shelf
router.put('/:shelfId', (req, res) => {
    res.json({ message: "UPDATE shelf", shelfId: req.params.shelfId });
});

// Delete a shelf
router.delete('/:shelfId', (req, res) => {
    res.json({ message: "DELETE shelf", shelfId: req.params.shelfId });
});



// Books Routes (nested within shelves)
// GET all books in a shelf
router.get('/:shelfId/books', (req, res) => {
    res.json({ message: "GET all books in shelf", shelfId: req.params.shelfId });
});

// GET a single book in a shelf
router.get('/:shelfId/books/:bookId', (req, res) => {
    res.json({ message: "GET single book", shelfId: req.params.shelfId, bookId: req.params.bookId });
});

// Add a book to a shelf
router.post('/:shelfId/books', (req, res) => {
    res.json({ message: "POST new book to shelf", shelfId: req.params.shelfId });
});

// Update a book in a shelf
router.put('/:shelfId/books/:bookId', (req, res) => {
    res.json({ message: "UPDATE book in shelf", shelfId: req.params.shelfId, bookId: req.params.bookId });
});

// Delete a book from a shelf
router.delete('/:shelfId/books/:bookId', (req, res) => {
    res.json({ message: "DELETE book from shelf", shelfId: req.params.shelfId, bookId: req.params.bookId });
});

module.exports = router;
