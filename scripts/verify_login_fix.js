const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const testLogin = async () => {
    try {
        if (!process.env.MONGO_URI) {
            // Fallback for dev environment if .env not loaded correctly or empty
            console.log("No MONGO_URI found, strictly using local fallback if needed or failing.");
            // In this environment, we expect .env to be present.
        }

        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");

        // Create a dummy user
        const testEmail = "test_login_verification_" + Date.now() + "@example.com";
        const testPass = "password123";

        // Ensure clean state
        await User.deleteOne({ email: testEmail });

        const user = await User.create({
            name: "Test User",
            email: testEmail,
            password: testPass,
            role: "employee",
            isApproved: true
        });

        console.log("User created:", user.email);

        // Fetch user again to test select: false behavior if we were doing a real login fetch
        const fetchedUser = await User.findOne({ email: testEmail }).select('+password');

        if (!fetchedUser) {
            console.error("FAILURE: Could not fetch user.");
            process.exit(1);
        }

        console.log("User fetched. Testing matchPassword...");

        // Test matchPassword
        const isMatch = await fetchedUser.matchPassword(testPass);
        console.log("Password match result (expect true):", isMatch);

        const isNotMatch = await fetchedUser.matchPassword("wrongpassword");
        console.log("Password mismatch result (expect false):", isNotMatch);

        if (isMatch && !isNotMatch) {
            console.log("SUCCESS: matchPassword works correctly.");
        } else {
            console.error("FAILURE: matchPassword failed logic.");
            process.exit(1);
        }

        // Cleanup
        await User.deleteOne({ email: testEmail });
        console.log("Cleanup done.");
        await mongoose.connection.close();
    } catch (err) {
        console.error("Error:", err);
        process.exit(1);
    }
};

testLogin();
