const mongoose = require('mongoose');

const shelfSchema = new mongoose.Schema({
    name: { type: String, required: true },  // Names like 'Reading', 'TBR', 'Finished'
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    books: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }]
});

module.exports = mongoose.model('Shelf', shelfSchema);
