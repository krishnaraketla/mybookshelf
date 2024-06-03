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

const app = express();
app.use(cors({ origin: 'http://localhost:3000' }));

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

