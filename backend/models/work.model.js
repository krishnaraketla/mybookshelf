const mongoose = require('mongoose');

// Define the schema for Work
const workSchema = new mongoose.Schema({
    _id: { type: String }, 
    workKey: { type: String, unique: true }, 
    title: { type: String, required: true },
    description: { type: String, default: '' },
    publishers: [{ type: String }],
    publishedYear: { type: Number },
    authors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Author' }],
    coverIDs: [{ type: Number }],
    subjects: [{ type: String }],
    ISBN_10: [{ type: String }],
    ISBN_13: [{ type: String }],
    languages: [{ type: String }],
    numberOfPages: { type: Number },
    formats: [{ type: String }],
    averageRating: { type: Number, default: 0 },
    editions: [{ type: String }],
}, {
    timestamps: true
});

workSchema.virtual('coverImageURL').get(function() {
    if (this.coverIDs && this.coverIDs.length > 0) {
        return `https://covers.openlibrary.org/b/id/${this.coverIDs[0]}-L.jpg`;
    }
    return 'https://via.placeholder.com/150'; // Default image
});

// Ensure virtual fields are serialized
workSchema.set('toJSON', { virtuals: true });
workSchema.set('toObject', { virtuals: true });

workSchema.index({ title: 'text', authors: 'text', subjects: 'text' });
workSchema.index({ ISBN_13: 1, ISBN_10: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('Work', workSchema);