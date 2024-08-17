const mongoose = require('mongoose');

const interactionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    bookId: { type: String, ref: 'Book', required: true }, 
    rating: { type: Number, min: 1, max: 5 },
    hasRead: { type: Boolean, default: false },
    dateStarted: { type: Date },
    dateFinished: { type: Date },
    review: { type: String, trim: true }
}, {
    timestamps: true // Automatically add createdAt and updatedAt fields
});

// Indexes to speed up querying
interactionSchema.index({ userId: 1, bookId: 1 }, { unique: true }); // Unique index to prevent duplicate interactions for the same book by the same user

module.exports = mongoose.model('Interaction', interactionSchema);