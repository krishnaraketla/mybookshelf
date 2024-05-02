const fs = require('fs');
const csv = require('csv-parser');
const mongoose = require('mongoose');
const Book = require('./models/Bookmodel');
require('dotenv').config();

function parseStringToArray(str) {
    return str.replace(/[\[\]']+/g, "").split(',').map(item => item.trim());
}

async function main() {
    await mongoose.connect(process.env.MONGO_URI_LIBRARY, { useNewUrlParser: true, useUnifiedTopology: true });
    
    // Clear the collection
    await Book.deleteMany({});
    console.log('Existing books have been cleared from the collection.');

    let totalProcessed = 0;

    fs.createReadStream('../data/books_data.csv')
        .pipe(csv())
        .on('data', async (data) => {
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
                ratingsCount: parseInt(data.ratingsCount) || 0
            };

            try {
                await Book.create(modifiedData);
                totalProcessed += 1;
                if(totalProcessed % 10000 == 0){
                    console.log(`Processed: ${totalProcessed} books`); // Simple progress indicator
                }
            } catch (error) {
                console.error('Error inserting book', error);
            }
        })
        .on('end', () => {
            console.log(`Total books processed: ${totalProcessed}`);
            //mongoose.disconnect();
        });
}

main().catch(err => {
    console.error('Failed to complete the operation:', err);
    //mongoose.disconnect();
});
