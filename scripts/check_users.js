const mongoose = require('mongoose');
const User = require('../models/User');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
        console.error(`Error: ${err.message}`);
        process.exit(1);
    }
};

const listUsers = async () => {
    await connectDB();
    const users = await User.find({});
    console.log('Total Users:', users.length);
    users.forEach(u => {
        console.log(`- ${u.name} (${u.email}) [Role: ${u.role}] [Approved: ${u.isApproved}]`);
    });
    process.exit();
};

listUsers();
