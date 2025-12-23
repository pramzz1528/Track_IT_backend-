const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config({ path: './.env' });

const verifyUserMgmt = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Cleanup
        await User.deleteMany({ email: { $in: ['pending1@example.com', 'pending2@example.com'] } });

        // 1. Create Pending Users
        console.log('1. Creating Pending Users...');
        await User.create({
            name: 'Pending 1',
            email: 'pending1@example.com',
            password: 'password',
            role: 'Employee',
            isApproved: false
        });

        const pending2 = await User.create({
            name: 'Pending 2',
            email: 'pending2@example.com',
            password: 'password',
            role: 'Employee',
            isApproved: false
        });

        // 2. Test Get Users (Simulate Logic)
        console.log('2. Testing Get Users (Filtering)...');
        // Simulate query filtering logic
        const query = { isApproved: false };
        const users = await User.find(query);

        const ourPendingUsers = users.filter(u => u.email.startsWith('pending'));
        if (ourPendingUsers.length === 2) {
            console.log('PASS: Retrieved 2 pending users.');
        } else {
            console.error('FAIL: Expected 2 pending users, got ' + ourPendingUsers.length);
        }

        // 3. Test Delete User (Simulate Logic)
        console.log('3. Testing Delete User...');
        await User.findByIdAndDelete(pending2._id);

        const remainingUsers = await User.find({ isApproved: false });
        const ourRemainingUsers = remainingUsers.filter(u => u.email.startsWith('pending'));

        if (ourRemainingUsers.length === 1 && ourRemainingUsers[0].email === 'pending1@example.com') {
            console.log('PASS: Successfully deleted Pending 2.');
        } else {
            console.error('FAIL: Deletion check failed.');
        }

        console.log('Verification Complete.');
        process.exit(0);

    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

verifyUserMgmt();
