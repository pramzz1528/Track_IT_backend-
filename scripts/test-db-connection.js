const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const connectDB = async () => {
    try {
        console.log('Attempting to connect to MongoDB...');
        console.log(`URI: ${process.env.MONGO_URI}`);

        const conn = await mongoose.connect(process.env.MONGO_URI);

        console.log(`MongoDB Connected: ${conn.connection.host}`);
        console.log('Database connection successful!');
        process.exit(0);
    } catch (err) {
        console.error(`Error: ${err.message}`);
        console.error('Make sure your MongoDB is running locally on port 27017');
        process.exit(1);
    }
};

connectDB();
