const express = require("express");
const router = express.Router();
const Shelf = require('../models/shelf.model');
const Book = require('../models/book.model');
const User = require('../models/user.model');
const auth = require('../middleware/auth');

// GET all shelves
router.get('/', auth, async (req, res) => {
    try {
        // Fetch the user and populate the shelves field
        const user = await User.findById(req.user.userId).populate('shelves', '_id name owner url');

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user.shelves);
    } catch (error) {
        res.status(500).json({ message: "Error fetching shelves", error: error.message });
    }
});

router.get('/:name', auth, async (req, res) => {
    try {
        const shelf = await Shelf.findOne({ name: req.params.name, owner: req.user.userId }).populate('books');
        if (!shelf) {
            return res.status(404).json({ message: "Shelf not found" });
        }
        res.json(shelf);
    } catch (error) {
        res.status(500).json({ message: "Error fetching shelf", error: error.message });
    }
});

// Create a new shelf
router.post('/', auth, async (req, res) => {
    try {
        const { name } = req.body;
        const newShelf = new Shelf({ name, owner: req.user.userId });
        await newShelf.save();
        res.status(201).json(newShelf);
    } catch (error) {
        res.status(500).json({ message: "Error creating shelf", error: error.message });
    }
});

// Update a shelf
router.put('/:name', auth, async (req, res) => {
    try {
        const updatedShelf = await Shelf.findOneAndUpdate(
            { _id: req.params.name, owner: req.user.userId },
            req.body,
            { new: true }
        );
        if (!updatedShelf) {
            return res.status(404).json({ message: "Shelf not found" });
        }
        res.json(updatedShelf);
    } catch (error) {
        res.status(500).json({ message: "Error updating shelf", error: error.message });
    }
});

// Delete a shelf
router.delete('/:name', auth, async (req, res) => {
    try {
        const deletedShelf = await Shelf.findOneAndDelete({ _id: req.params.name, owner: req.user.userId });
        if (!deletedShelf) {
            return res.status(404).json({ message: "Shelf not found" });
        }
        res.json({ message: "Shelf deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting shelf", error: error.message });
    }
});



// Books Routes (nested within shelves)

// GET all books in a shelf
router.get('/:id/books', auth, async (req, res) => {
    try {
        const shelf = await Shelf.findOne({ _id: req.params.id, owner: req.user.userId }).populate("books");
        if (!shelf) {
            return res.status(404).json({ message: "Shelf not found" });
        }
        res.json(shelf.books);
    } catch (error) {
        res.status(500).json({ message: "Error fetching books", error: error.message });
    }
});


// Add a book to a shelf
router.post('/:id/books', auth, async (req, res) => {
    const { googleId, title, description, publisher, yearPublished, authors, image, category, ISBN, language, pages, format, averageRating } = req.body;

    // Basic validation
    if (!title) {
        return res.status(400).json({ message: "Title is required" });
    }

    try {
        // Create a new book
        const existingBook = await Book.findOne({ $or: [{ googleId }, { ISBN }] });
        if(!existingBook){

            const newBook = new Book({
                _id: ISBN, googleId, title, description, publisher, yearPublished, authors, image, category, ISBN, language, pages, format, averageRating
            });

            newBook.save();

            // Find the shelf by ID and owner
            const shelf = await Shelf.findOne({ _id: req.params.id, owner: req.user.userId });
            if (!shelf) {
                return res.status(404).json({ message: "Shelf not found" });
            }

            // Add the new book to the shelf
            shelf.books.push(newBook._id);
            await shelf.save();

            // Return the saved book in the response
            res.status(201).json(existingBook);
        }
        else{
            // Find the shelf by ID and owner
            const shelf = await Shelf.findOne({ _id: req.params.id, owner: req.user.userId });
            if (!shelf) {
                return res.status(404).json({ message: "Shelf not found" });
            }

            // Add the new book to the shelf
            shelf.books.push(existingBook);
            await shelf.save();

            // Return the saved book in the response
            res.status(201).json(existingBook);
        }

    } catch (error) {
        res.status(500).json({ message: "Error adding book to shelf", error: error.message });
    }
});

// Update a book in a shelf
router.put('/:name/books/:bookId', auth, async (req, res) => {
    try {
        const updatedBook = await Book.findByIdAndUpdate(req.params.bookId, req.body, { new: true });
        if (!updatedBook) {
            return res.status(404).json({ message: "Book not found" });
        }
        res.json(updatedBook);
    } catch (error) {
        res.status(500).json({ message: "Error updating book", error: error.message });
    }
});

// Delete book from a shelf
router.delete('/:id/books/:bookId', auth, async (req, res) => {
    try {
        // Find the shelf by ID and owner
        const shelf = await Shelf.findOne({ _id: req.params.id, owner: req.user.userId });
        if (!shelf) {
            return res.status(404).json({ message: "Shelf not found" });
        }

        // Remove the book by its ID from the shelf's books array
        const bookIndex = shelf.books.findIndex(book => book === req.params.bookId);
        if (bookIndex > -1) {
            shelf.books.splice(bookIndex, 1);
            await shelf.save();
        } else {
            return res.status(404).json({ message: "Book not found in shelf" });
        }

        res.json({ message: "Book deleted successfully from shelf" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting book from shelf", error: error.message });
    }
});

module.exports = router;
