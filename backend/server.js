require('dotenv').config()
const express = require("express")
const mongoose = require("mongoose")
const shelvesRoutes = require("./routes/shelves")

// express app
const app = express()

//middleware
app.use(express.json());

//routes
app.use('/api/shelves',shelvesRoutes)

// connect to db
mongoose.connect(process.env.MONGO_URI)
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
