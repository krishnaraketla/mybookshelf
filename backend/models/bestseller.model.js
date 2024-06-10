const mongoose = require('mongoose');
const bookSchema = require('./book.model');

const bestsellerSchema = new mongoose.Schema({
    name: { type: String, required: true, index: true },  // Names like 'Fiction', 'Non-Fiction'
    books: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }]
});

// Virtual field for dynamic link
bestsellerSchema.virtual('url').get(function() {
    return `/shelves/${this._id}/books`;
});

// Ensure virtual fields are serialized
bestsellerSchema.set('toJSON', { virtuals: true });
bestsellerSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('bestseller', bestsellerSchema);
