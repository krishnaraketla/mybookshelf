const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: String,
    description: String,
    authors: [String], // Array of authors
    image: String,
    previewLink: String,
    publisher: String,
    publishedDate: String,
    infoLink: String,
    categories: [String], // Array of categories
    ratingsCount: Number
});

module.exports = mongoose.model('Book', bookSchema);
