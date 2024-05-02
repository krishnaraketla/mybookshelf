const fs = require('fs');
const csv = require('csv-parser');
const mongoose = require('mongoose');
const Book = require('./models/Bookmodel');
require('dotenv').config();

function parseStringToArray(str) {
    return str.replace(/[\[\]']+/g, "").split(',').map(item => item.trim());
}

mongoose.connect(process.env.MONGO_URI_MYBOOKSHELF, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected!"))
    .catch(err => {
        console.log("Failed to connect to MongoDB", err);
        setTimeout(() => {
            mongoose.connect(process.env.MONGO_URI_MYBOOKSHELF, { useNewUrlParser: true, useUnifiedTopology: true });
        }, 3000); // Try to reconnect every 3 seconds
    });

mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to db');
});

mongoose.connection.on('error', (err) => {
    console.log('Mongoose connection error: ' + err);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected');
});

const batchSize = 100; // Adjust batch size as needed

let batch = [];
let totalProcessed = 0;

fs.createReadStream('../data/books_data.csv')
    .pipe(csv())
    .on('data', (data) => {
        // Convert string representations to arrays
        let modifiedData = {
            title: data.Title,
            description: data.description,
            authors: parseStringToArray(data.authors),
            image: data.image,
            previewLink: data.previewLink,
            publisher: data.publisher,
            publishedDate: data.publishedDate,
            infoLink: data.infoLink,
            categories: parseStringToArray(data.categories),
            ratingsCount: data.ratingsCount || 0  // Assuming you want to default to 0 if empty
        };

        batch.push(modifiedData);

        if (batch.length >= batchSize) {
            // Process the current batch
            processBatch(batch);
            batch = []; // Clear the batch array
        }
    })
    .on('end', () => {
        // Process the remaining books in the last batch
        if (batch.length > 0) {
            processBatch(batch);
        }
        console.log('All books have been processed');
        mongoose.connection.close();
    });

async function processBatch(batch) {
    try {
        const result = await Book.create(batch);
        totalProcessed += result.length;
        console.log(`Processed ${result.length} books. Total processed: ${totalProcessed}`);
    } catch (error) {
        console.error(error);
    }
}
