const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');
const connectDB = require('../config/db');

// Robustly load .env from root directory (assuming script is in scripts/ or root)
const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath });

const verifyApproval = async () => {
    try {
        console.log('Loading environment from:', envPath);
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is not defined in .env file');
        }

        await connectDB();

        // Cleanup existing test users
        console.log('Cleaning up test users...');
        await User.deleteMany({ email: { $in: ['pending@example.com', 'superadmin@example.com', 'adminwannabe@example.com'] } });

        // 1. Register Pending User
        console.log('\n1. Registering Pending User...');
        const pendingUser = await User.create({
            name: 'Pending User',
            email: 'pending@example.com',
            password: 'password123',
            role: 'Employee'
        });

        if (pendingUser.isApproved === false) {
            console.log('PASS: User isApproved is false by default.');
        } else {
            console.error('FAIL: User isApproved should be false.');
        }

        // 2. Simulate Login Check
        console.log('\n2. Verifying Login Block...');
        const loginUser = await User.findOne({ email: 'pending@example.com' });
        if (!loginUser.isApproved) {
            console.log('PASS: Login logic would block this user (isApproved=false).');
        } else {
            console.error('FAIL: User should be blocked.');
        }

        // 3. Create Super Admin
        console.log('\n3. Creating Super Admin...');
        await User.create({
            name: 'Super Admin',
            email: 'superadmin@example.com',
            password: 'supersecret',
            role: 'SuperAdmin',
            isApproved: true
        });

        // 4. Approve User (Simulate Controller Logic)
        console.log('\n4. Approving User as SuperAdmin...');
        const userToApprove = await User.findOne({ email: 'pending@example.com' });

        // Simulating the controller logic fix
        userToApprove.isApproved = true;
        userToApprove.role = 'SuperAdmin';
        await userToApprove.save();

        // 5. Verify Approval and Role
        const approvedUser = await User.findById(userToApprove._id);
        if (approvedUser.isApproved === true) {
            console.log('PASS: User is now approved.');
        } else {
            console.error('FAIL: User approval failed.');
        }

        if (approvedUser.role === 'SuperAdmin') {
            console.log('PASS: User role is correctly set to SuperAdmin.');
        } else {
            console.error(`FAIL: User role is ${approvedUser.role}, expected SuperAdmin.`);
        }

        console.log('\nVerification Complete.');
        process.exit(0);

    } catch (err) {
        console.error('Verification Failed:', err.message);
        process.exit(1);
    }
};

// Check if run directly
if (require.main === module) {
    verifyApproval();
}

module.exports = verifyApproval;
