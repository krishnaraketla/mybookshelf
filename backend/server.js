require('dotenv').config()
const express = require("express")
const mongoose = require("mongoose")
const shelvesRoutes = require("./routes/shelves")
const allBooksRoutes = require("./routes/search_all_books")

// express app
const app = express()

//middleware
app.use(express.json());

//routes
app.use('/api/shelves',shelvesRoutes)
app.use('/api/search/books',allBooksRoutes)

// connect to db
mongoose.connect(process.env.MONGO_URI_LIBRARY)
    .then(() => {
        console.log("db connected!")
        // listen for requests
        app.listen(process.env.PORT, () => {
        console.log("Listening on port 4000")
})

    })
    .catch((error) => {
        console.log(error)
    })
