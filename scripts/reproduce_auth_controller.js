const mongoose = require('mongoose');
const dotenv = require('dotenv');
// Load env vars
dotenv.config();

// Connect to database
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
        console.error(`Error: ${err.message}`);
        process.exit(1);
    }
};

const run = async () => {
    await connectDB();

    console.log("Loading authController...");
    const authController = require('../controllers/authController');

    // Create a mock request and response
    const req = {
        body: {
            email: "test_login_verification@example.com", // Assuming this user from previous test might still exist or we create one
            password: "password123"
        }
    };

    // Make sure user exists first
    const User = require('../models/User');
    // Ensure clean state
    await User.deleteOne({ email: req.body.email });
    await User.create({
        name: "Test User Controller",
        email: req.body.email,
        password: req.body.password,
        role: "employee",
        isApproved: true
    });
    console.log("User ensuring complete.");

    const res = {
        status: function (code) {
            console.log("Response Status:", code);
            return this;
        },
        json: function (data) {
            console.log("Response JSON:", data);
            return this;
        }
    };

    console.log("Calling login...");
    try {
        await authController.login(req, res);
    } catch (error) {
        console.error("Caught error in controller execution:", error);
    }

    await mongoose.connection.close();
};

run();
