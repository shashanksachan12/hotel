// server.js

// --- Load Environment Variables ---
// This line MUST be at the very top
// It loads your secret DATABASE_URL from the .env file
require('dotenv').config(); 

// --- Import Tools ---
const express = require('express');
const path = require('path');
const mongoose = require('mongoose'); // Import Mongoose (for database)
const app = express();
const PORT = 3000;

// --- Import Your Data "Blueprint" ---
// This imports the models/Booking.js file
const Booking = require('./models/Booking');

// --- Connect to MongoDB ---
// We get the secret "key" (connection string) from our .env file
const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hotel';

(async () => {
	try {
		await mongoose.connect(mongoUri);
		console.log(`[MongoDB] Connected to ${mongoUri}`);
	} catch (err) {
		console.error('[MongoDB] Connection error:', err);
		// Do not throw here so the server can still run for dev when DB is unavailable.
	}
})();

// --- "Middleware" (The Server's Setup) ---

// 1. Tell Express how to read JSON data from the frontend
app.use(express.json());
// 2. Tell Express to serve all our HTML, CSS, and JS from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));


// --- API Routes (Where the "work" happens) ---

// This creates an "endpoint" or "listener" at /api/book
// When the frontend sends data here (with POST), this function runs
// We use 'async' because 'await' (database saving) takes time
app.post('/api/book', async (req, res) => {
    
    console.log('Booking request received!');
    // req.body is the JSON data { name, email, ... } from the frontend
    console.log(req.body); 

    // 'try...catch' is for error handling.
    // We "try" to save to the database...
    try {
        // --- Database Logic ---
        
        // 1. Create a new booking object in memory using our model
        const newBooking = new Booking({
            name: req.body.name,
            email: req.body.email,
            roomType: req.body.roomType,
            checkIn: req.body.checkIn
        });

        // 2. Save the new booking to the MongoDB database
        //    'await' pauses the code here until the save is complete
        const savedBooking = await newBooking.save(); 
        
        console.log('Booking saved!', savedBooking);
        // ---

        // Send a success (201) response back to the frontend
        res.status(201).json({
            message: `Booking confirmed for ${savedBooking.name}!`,
            bookingDetails: savedBooking
        });

    } catch (error) {
        // ...if the 'try' block fails, this 'catch' block runs
        console.error('Error saving booking:', error);
        
        // Send an error (500) response back to the frontend
        res.status(500).json({
            message: 'Error: Could not save booking. Please try again.'
        });
    }
});

// --- Start the Server ---
// This turns on the server and makes it listen for visitors
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});