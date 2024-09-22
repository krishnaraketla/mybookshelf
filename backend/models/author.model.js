const authorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    birth_date: String,
    death_date: String,
    bio: String,
    // Add other relevant fields
});

module.exports = mongoose.model('Author', authorSchema);
