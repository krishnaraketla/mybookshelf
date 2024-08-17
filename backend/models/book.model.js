const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    _id: { type: String },
    googleId: String,
    title: { type: String, required: true },
    description: String,
    publisher: String,
    yearPublished: Number,
    authors: [String],
    image: String,
    category: String,
    ISBN: { type: String, unique: true },
    language: String,
    pages: Number,
    format: String,
    averageRating: Number
});

bookSchema.index({ title: 'text', authors: 'text'});
bookSchema.index({ ISBN: 1 });

module.exports = mongoose.model('Book', bookSchema);