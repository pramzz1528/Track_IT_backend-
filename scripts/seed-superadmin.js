const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const seedSuperAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${mongoose.connection.host}`);

        // Check if super admin exists
        let superAdmin = await User.findOne({ role: 'SuperAdmin' });

        if (superAdmin) {
            console.log('Super Admin already exists. resetting password...');
            superAdmin.password = 'admin123';
            superAdmin.isApproved = true; // Ensure approved
            await superAdmin.save();
            console.log(`Super Admin updated.`);
            console.log(`Email: ${superAdmin.email}`);
            console.log('Password: admin123');
        } else {
            // Create Super Admin
            superAdmin = await User.create({
                name: 'Super Admin',
                email: 'admin@exe.com',
                password: 'admin123',
                role: 'SuperAdmin',
                isApproved: true,
                designation: 'System Administrator',
                department: 'IT',
                phone: '0000000000'
            });
            console.log('Super Admin created successfully!');
            console.log('Email: admin@exe.com');
            console.log('Password: admin123');
        }

        process.exit(0);
    } catch (err) {
        console.error(`Error: ${err.message}`);
        process.exit(1);
    }
};

seedSuperAdmin();
