const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
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
    price: Number,
    dateAdded: { type: Date, default: Date.now },
    averageRating: Number
});

bookSchema.index({ title: 'text' });
bookSchema.index({ authors: 'text' });

module.exports = mongoose.model('Book', bookSchema);
