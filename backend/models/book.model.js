const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    googleId: String,
    title: { type: String, required: true },
    description: String,
    publisher: String,
    yearPublished: Number,
    authors: [String],
    image: String,
    category: String,
    ISBN: String,
    language: String,
    pages: Number,
    format: String,
    averageRating: Number
});

bookSchema.index({ title: 'text', authors: 'text' });

module.exports = mongoose.model('Book', bookSchema);