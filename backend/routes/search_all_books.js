const express = require('express');
const router = express.Router();
const fs = require('fs');

const GOOGLE_BOOKS_API_KEY = 'AIzaSyCrq_JxAEC9Iilk4_YPxEAntdsaZExQjW8';
// const GOOGLE_BOOKS_API_KEY = 'AIzaSyCOV84YnFqPgh06jBIroRXPcUsZEjBwm8k';
// const GOOGLE_BOOKS_API_KEY = '<dummy>';
const GOOGLE_BOOKS_API_BASE_URL = 'https://www.googleapis.com/books/v1';

async function fetchGoogleBooks(url) {
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(url);
    return response.json();
}

// Mapping function to convert Google Books API response to Book schema
function mapToBookSchema(item) {
    const volumeInfo = item.volumeInfo;
    const imageLinks = volumeInfo.imageLinks || {};
    const book = {
        _id: item.id,
        title: volumeInfo.title,
        authors: volumeInfo.authors || [],
        description: volumeInfo.description || '',
        image: imageLinks.large || imageLinks.medium || imageLinks.small || imageLinks.thumbnail,
        publisher: volumeInfo.publisher || '',
        yearPublished: volumeInfo.publishedDate ? parseInt(volumeInfo.publishedDate.split("-")[0]) : null,
        category: volumeInfo.categories ? volumeInfo.categories[0] : '',
        ISBN: volumeInfo.industryIdentifiers?.find(id => id.type === 'ISBN_13')?.identifier || '',
        language: volumeInfo.language,
        pages: volumeInfo.pageCount || 0,
        format: volumeInfo.printType,
        price: volumeInfo.listPrice?.amount || 0,
        averageRating: volumeInfo.averageRating || 0
    };
    return book;
}

router.get('/title', async (req, res) => {
    const { query } = req.query;
    if (!query) {
        return res.status(400).json({ message: "Query parameter is required for searching with title." });
    }
    try {
        const data = await fetchGoogleBooks(`${GOOGLE_BOOKS_API_BASE_URL}/volumes?q=intitle:${encodeURIComponent(query)}&key=${GOOGLE_BOOKS_API_KEY}`);
        
        // Log the full data object
        // fs.writeFileSync('full_data.json', JSON.stringify(data, null, 2));
        // console.log("Full data from Google Books API saved to full_data.json");

        const books = data.items.map(item => {
            // Log each item individually
            // fs.writeFileSync(`book_item_${item.id}.json`, JSON.stringify(item, null, 2));
            // console.log(`Book item saved to book_item_${item.id}.json`);

            return mapToBookSchema(item);
        });

        res.json(books);
    } catch (error) {
        res.status(500).json({ message: "Error searching for books by title", error: error.message });
    }
});

router.get('/author', async (req, res) => {
    const { query } = req.query;
    if (!query) {
        return res.status(400).json({ message: "Query parameter is required for searching with author." });
    }
    try {
        const data = await fetchGoogleBooks(`${GOOGLE_BOOKS_API_BASE_URL}/volumes?q=inauthor:${encodeURIComponent(query)}&key=${GOOGLE_BOOKS_API_KEY}`);
        
        // Log the full data object
        //fs.writeFileSync('full_data.json', JSON.stringify(data, null, 2));
        console.log("Full data from Google Books API saved to full_data.json");

        const books = data.items.map(item => {
            // Log each item individually
            //fs.writeFileSync(`book_item_${item.id}.json`, JSON.stringify(item, null, 2));
            console.log(`Book item saved to book_item_${item.id}.json`);

            return mapToBookSchema(item);
        });

        res.json(books);
    } catch (error) {
        res.status(500).json({ message: "Error searching for books by title", error: error.message });
    }
});

// Get book by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const data = await fetchGoogleBooks(`${GOOGLE_BOOKS_API_BASE_URL}/volumes/${id}?key=${GOOGLE_BOOKS_API_KEY}`);
        if (!data || data.error) {
            return res.status(404).json({ message: "Book not found" });
        }

        const book = mapToBookSchema(data);
        res.json(book);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving the book", error: error.message });
    }
});

module.exports = router;

///books/qCxIAgAAQBAJ
// http://localhost:3000/books/cZpR_0kN9gEC
