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
async function fetchOpenLibraryData(url) {
    await loadFetch()
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Open Library API error: ${response.statusText}`);
    }
    return await response.json();
}

// Route to search for books by title, author, or ISBN
router.get('/', async (req, res) => {
    const { query, author, isbn } = req.query;

    if (!query && !author && !isbn) {
        return res.status(400).json({
            message: "At least one of 'query', 'author', or 'isbn' parameters is required for searching."
        });
    }

    try {
        let url = `https://openlibrary.org/search.json?limit=20`;

        if (query) url += `&title=${encodeURIComponent(query)}`;
        if (author) url += `&author=${encodeURIComponent(author)}`;
        if (isbn) url += `&isbn=${encodeURIComponent(isbn)}`;

        const data = await fetchOpenLibraryData(url);

        // Map search results to simplified work data
        const results = data.docs.map(doc => ({
            workID: doc.key.replace('/works/', ''),
            title: doc.title,
            authorNames: doc.author_name || [],
            firstPublishYear: doc.first_publish_year || null,
            editionCount: doc.edition_count || 0,
            coverID: doc.cover_i || null,
        }));

        res.json(results);
    } catch (error) {
        console.error('Error searching for books:', error);
        res.status(500).json({ message: "Error searching for books", error: error.message });
    }
});

// Route to get details of a specific work, including cover, description, and editions
router.get('/works/:workID', async (req, res) => {
    const { workID } = req.params;

    try {
        // Fetch work details
        const workURL = `https://openlibrary.org/works/${workID}.json`;
        const workData = await fetchOpenLibraryData(workURL);

        // Fetch editions of the work
        const editionsURL = `https://openlibrary.org/works/${workID}/editions.json?limit=20`;
        const editionsData = await fetchOpenLibraryData(editionsURL);

        const authorNames = await Promise.all(workData.authors.map(async (author) => {
            const authorURL = `https://openlibrary.org${author.author.key}.json`;  // Fetch author details
            const authorData = await fetchOpenLibraryData(authorURL);
            return authorData.name;  // Return author name
        }));

        // Construct response data
        const response = {
            workID: workData.key.replace('/works/', ''),
            title: workData.title,
            workDescription: workData.description ? (workData.description.value || workData.description) : null,
            coverIDs: workData.covers || [],
            authors: workData.authors || [],
            authorNames: authorNames || [],
            subjects: workData.subjects || [],
            firstSentence: workData.first_sentence,
            firstPublished: workData.first_publish_date,
            editionCount: workData.edition_count,
            editions: editionsData.entries.map(edition => ({
                editionID: edition.key.replace('/books/', ''),
                title: edition.title,
                publishers: edition.publishers || [],
                publishDate: edition.publish_date || null,
                coverIDs: edition.covers || [],
                isbn: edition.isbn_10 || edition.isbn_13 || [],
                editionDescription: edition.description ? (edition.description.value || edition.description) : null,
            })),
        };

        res.json(response);
    } catch (error) {
        console.error('Error fetching work details:', error);
        res.status(500).json({ message: "Error fetching work details", error: error.message });
    }
});

// Route to get cover image by cover ID
router.get('/covers/:coverID', (req, res) => {
    const { coverID } = req.params;
    const size = req.query.size || 'L'; // Available sizes: S, M, L
    const url = `https://covers.openlibrary.org/b/id/${coverID}-${size}.jpg`;
    res.redirect(url);
});

module.exports = router;
