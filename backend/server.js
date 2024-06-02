require('dotenv').config()
const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const shelvesRoutes = require("./routes/shelves");
const allBooksRoutes = require("./routes/search_all_books");
const authRoutes = require("./routes/authRoutes");

const app = express();
app.use(cors({ origin: 'http://localhost:3000' }));

app.use(express.json());

// Routes
app.use('/shelves', shelvesRoutes);
app.use('/search/books', allBooksRoutes);
app.use('/auth', authRoutes);

mongoose.connect(process.env.MONGO_URI_LIBRARY)
    .then(() => {
        console.log("db connected!");
        app.listen(process.env.PORT || 4000, () => { // Ensure PORT fallback if env variable isn't set
            console.log("Listening on port " + (process.env.PORT || 4000));
        });
    })
    .catch((error) => {
        console.log(error);
    });

