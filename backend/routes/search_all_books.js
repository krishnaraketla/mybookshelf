const express = require('express');
const router = express.Router();
let fetch;

async function loadFetch() {
    if (!fetch) {
        fetch = (await import('node-fetch')).default;
    }
}
const Book = require('../models/book.model');  // Adjust the path as necessary

// Helper function to fetch data from Google Books API
async function fetchGoogleBooks(url) {
    await loadFetch();
    const response = await fetch(url);
    return response.json();
}

// Function to map Google Books API response to Book schema
function mapToBookSchema(item) {
    const volumeInfo = item.volumeInfo;
    const imageLinks = volumeInfo.imageLinks || {};
    return {
        googleId: item.id,  // Store Google's ID for potential future reference
        title: volumeInfo.title,
        authors: volumeInfo.authors || [],
        description: volumeInfo.description || '',
        image: "https://books.google.com/books/content?id=" + item.id + "&printsec=frontcover&img=1&zoom=4&edge=curl&source=gbs_api" || imageLinks.large || imageLinks.medium || imageLinks.small || imageLinks.thumbnail,
        publisher: volumeInfo.publisher || '',
        yearPublished: volumeInfo.publishedDate ? parseInt(volumeInfo.publishedDate.split("-")[0], 10) : null,
        category: volumeInfo.categories ? volumeInfo.categories[0] : '',
        ISBN: volumeInfo.industryIdentifiers?.find(id => id.type === 'ISBN_13')?.identifier || '',
        language: volumeInfo.language,
        pages: volumeInfo.pageCount || 0,
        format: volumeInfo.printType,
        averageRating: volumeInfo.averageRating || 0
    };
}

// Endpoint to search books by title
router.get('/title', async (req, res) => {
    const { query } = req.query;
    if (!query) {
        return res.status(400).json({ message: "Query parameter is required for searching with title." });
    }
    try {
        const url = `${process.env.GOOGLE_BOOKS_API_BASE_URL}/volumes?q=intitle:${encodeURIComponent(query)}&key=${process.env.GOOGLE_BOOKS_API_KEY}`;
        const data = await fetchGoogleBooks(url);

        const books = data.items.map((item) => {
            return mapToBookSchema(item);
        });

        res.json(books);
    } catch (error) {
        res.status(500).json({ message: "Error searching for books by title", error: error.message });
    }
});

// Endpoint to search books by author
router.get('/author', async (req, res) => {
    const { query } = req.query;
    if (!query) {
        return res.status(400).json({ message: "Query parameter is required for searching with author." });
    }
    try {
        const url = `${process.env.GOOGLE_BOOKS_API_BASE_URL}/volumes?q=inauthor:${encodeURIComponent(query)}&key=${process.env.GOOGLE_BOOKS_API_KEY}`;
        const data = await fetchGoogleBooks(url);

        const books = data.items.map(mapToBookSchema);

        res.json(books);
    } catch (error) {
        res.status(500).json({ message: "Error searching for books by author", error: error.message });
    }
});

// Get a specific book by Google Books API ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const url = `${process.env.GOOGLE_BOOKS_API_BASE_URL}/volumes/${id}?key=${process.env.GOOGLE_BOOKS_API_KEY}`;
        const data = await fetchGoogleBooks(url);

        if (!data || data.error) {
            return res.status(404).json({ message: "Book not found" });
        }

        book = new Book(mapToBookSchema(data));

        res.json(book);
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: "Error retrieving the book", error: error.message });
    }
});

module.exports = router;

///books/qCxIAgAAQBAJ
// http://localhost:3000/books/cZpR_0kN9gEC
