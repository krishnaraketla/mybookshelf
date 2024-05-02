require('dotenv').config()
const express = require("express");
const mongoose = require("mongoose");
const shelvesRoutes = require("./routes/shelves");
const allBooksRoutes = require("./routes/search_all_books");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(express.json());

// Routes
app.use('/shelves', shelvesRoutes);
app.use('/search/books', allBooksRoutes);
app.use('/auth', authRoutes);  // Updated to have a base path for all auth related routes

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

