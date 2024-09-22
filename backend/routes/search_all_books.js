const express = require('express');
const router = express.Router();
const fs = require('fs');
let fetch;

async function loadFetch() {
    if (!fetch) {
        fetch = (await import('node-fetch')).default;
    }
}

const Book = require('../models/work.model');  // Adjust the path as necessary

// Helper function to fetch data from Open Library API
async function fetchOpenLibraryBooks(url) {
    await loadFetch();
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch data from Open Library API: ${response.statusText}`);
    }
    return response.json();
}

// Function to map Open Library API response to Book schema
function mapToBookSchema(item) {
    let description = '';
    if (item.description) {
        if (typeof item.description === 'string') {
            description = item.description;
        } else if (typeof item.description === 'object' && item.description.value) {
            description = item.description.value;
        }
    }
    console.log(item.description)
    return {
        _id: item.key, // e.g., "/works/OL12345W" @todo: should this be isbn? what if we change api?
        workKey: item.key,
        title: item.title || '',
        description: description,
        publishers: item.publishers || [],
        publishedYear: item.first_publish_year || null,
        authors: item.author_name || [],
        coverIDs: item.cover_i ? [item.cover_i] : [],
        subjects: item.subject || [],
        ISBN_10: item.isbn_10 || [],
        ISBN_13: item.isbn_13 || [],
        languages: item.language || [],
        numberOfPages: item.number_of_pages_median || 0,
        formats: item.format || [],
        averageRating: 0, // Placeholder
        editions: item.edition_key || []
    };
}

// Function to map Open Library API response to Edition schema
function mapToEditionSchema(item) {
    let description = '';
    console.log("\n\n trying to get description from work: \n")
    if (item.description) {
        if (typeof item.description === 'string') {
            description = item.description;
            console.log("======= item.description " ,item.description)
        } else if (typeof item.description === 'object' && item.description.value) {
            description = item.description.value;
            console.log("=======" ,item.description.value)
        }
    }
    return {
        editionKey: item.key.replace('/books/', ''), // e.g., "OL12345M"
        workKey: item.works && item.works[0] ? item.works[0].key : '',
        title: item.title || '',
        description: description,
        publishers: item.publishers || [],
        publishDate: item.publish_date || '',
        numberOfPages: item.number_of_pages || 0,
        ISBN_10: item.isbn_10 || [],
        ISBN_13: item.isbn_13 || [],
        languages: item.languages ? item.languages.map(lang => lang.key) : [],
        // Add other relevant fields if needed
    };
}

// Endpoint to search books by title and return editions
router.get('/title', async (req, res) => {
    const { query } = req.query;
    if (!query) {
        return res.status(400).json({ message: "Query parameter is required for searching with title." });
    }
    try {
        // Fetch works matching the title
        const worksUrl = `https://openlibrary.org/search.json?title=${encodeURIComponent(query)}&limit=20`;
        const worksData = await fetchOpenLibraryBooks(worksUrl);

        // For each work, fetch the first edition
        const editionsPromises = worksData.docs.map(async (work) => {
            const workId = work.key.replace('/works/', '');
            const editionsUrl = `https://openlibrary.org/works/${workId}/editions.json?limit=1`;
            const editionsData = await fetchOpenLibraryBooks(editionsUrl);
            const edition = editionsData.entries[0];

            if (edition) {
                return mapToEditionSchema(edition);
            }
            return null;
        });

        // Wait for all promises to resolve
        const editions = await Promise.all(editionsPromises);

        // Filter out any null editions
        const filteredEditions = editions.filter(edition => edition !== null);

        res.json(filteredEditions);
    } catch (error) {
        console.error('Error searching for editions by title:', error);
        res.status(500).json({ message: "Error searching for editions by title", error: error.message });
    }
});

// Endpoint to search books by author
router.get('/author', async (req, res) => {
    const { query } = req.query;
    if (!query) {
        return res.status(400).json({ message: "Query parameter is required for searching with author." });
    }
    try {
        const url = `https://openlibrary.org/search.json?author=${encodeURIComponent(query)}&limit=20`; // Adjust limit as needed
        const data = await fetchOpenLibraryBooks(url);

        const books = data.docs.map(mapToBookSchema);

        res.json(books);
    } catch (error) {
        console.error('Error searching for books by author:', error);
        res.status(500).json({ message: "Error searching for books by author", error: error.message });
    }
});

module.exports = router;

// Example Open Library URLs:
// https://openlibrary.org/works/OL27448W.json
// https://openlibrary.org/works/OL27448W/editions.json
// Accessing a specific book:
// http://localhost:3000/books/OL27448W
