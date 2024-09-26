const mongoose = require('mongoose');
const workSchema = require('./work.model');

const editionSchema = new mongoose.Schema({
    editionKey: { type: String, unique: true },
    workKey: { type: String, ref: 'Work' },
    publishDate: String,
    publishers: [String],
    numberOfPages: Number,
    ISBN_10: [String],
    ISBN_13: [String],
    languages: [String],
    // Add other relevant fields
}, {
    timestamps: true
});

module.exports = mongoose.model('Edition', editionSchema);