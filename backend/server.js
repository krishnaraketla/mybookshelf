require('dotenv').config()
const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const bcrypt = require('bcryptjs');
const shelvesRoutes = require("./routes/shelves");
const allBooksRoutes = require("./routes/search_all_books");
const authRoutes = require("./routes/authRoutes");
const User = require("./models/user.model")
const Shelf = require('./models/shelf.model');
const path = require('path');

const app = express();

const corsOptions = {
    origin: function (origin, callback) {
        const allowedOrigins = ['http://localhost:3000', 'https://dry-chamber-11355-49a79aec1802.herokuapp.com', 'https://www.my-book-shelf.com'];
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
};

app.use(cors(corsOptions));

app.use(express.json());

// Routes
app.use('/shelves', shelvesRoutes);
app.use('/search/books', allBooksRoutes);
app.use('/auth', authRoutes);

// Function to create a default user and shelves
const createDefaultUser = async () => {
    const defaultUsername = 'testuser';
    const defaultPassword = 'testpassword';

    const existingUser = await User.findOne({ username: defaultUsername });
    if (existingUser) {
        console.log('Default user already exists');
        return;
    }

    const hashedPassword = await bcrypt.hash(defaultPassword, 8);
    console.log('Hashed Password:', hashedPassword); 
    const defaultUser = new User({ username: defaultUsername, password: hashedPassword });

    try {
        await defaultUser.save();
        console.log('Default user created successfully');

        // Create default shelves
        const shelves = ['tbr', 'reading', 'finished'];
        for (const shelfName of shelves) {
            const shelf = new Shelf({ name: shelfName, owner: defaultUser._id });
            await shelf.save();
            defaultUser.shelves.push(shelf._id);
        }

        await defaultUser.save(); // Save user with updated shelves
        console.log('Default shelves created successfully');
    } catch (error) {
        console.error('Error creating default user and shelves:', error.message);
    }
};

mongoose.connect(process.env.MONGO_URI_LIBRARY)
    .then( async() => {
        console.log("db connected!");
        await createDefaultUser();
        app.listen(process.env.PORT || 4000, () => { // Ensure PORT fallback if env variable isn't set
            console.log("Listening on port " + (process.env.PORT || 4000));
        });
    })
    .catch((error) => {
        console.log(error);
    });

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Route to serve the frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

// Define a simple route
app.get('/api', (req, res) => {
    // res.send('Hello, World!');
});

