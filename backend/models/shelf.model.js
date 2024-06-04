const mongoose = require('mongoose');

const shelfSchema = new mongoose.Schema({
    name: { type: String, required: true, index: true },  // Names like 'Reading', 'TBR', 'Finished'
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    books: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }]
});

// Virtual field for dynamic link
shelfSchema.virtual('link').get(function() {
    return `/shelves/${this._id}/books`;
});

// Ensure virtual fields are serialized
shelfSchema.set('toJSON', { virtuals: true });
shelfSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Shelf', shelfSchema);
