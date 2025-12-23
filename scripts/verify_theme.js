const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config({ path: './.env' });

const verifyTheme = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Cleanup
        await User.deleteOne({ email: 'themetest@example.com' });

        // 1. Create User
        console.log('1. Creating User...');
        const user = await User.create({
            name: 'Theme Tester',
            email: 'themetest@example.com',
            password: 'password123',
            role: 'Employee',
            isApproved: true
        });

        console.log(`Initial Theme: ${user.theme}`);
        if (user.theme !== 'light') {
            console.error('FAIL: Default theme should be light');
        }

        // 2. Simulate Update Theme (Dark)
        console.log('2. Updating Theme to Dark...');
        const userToUpdate = await User.findById(user._id);

        // Simulating controller logic
        if (['light', 'dark'].includes('dark')) {
            userToUpdate.theme = 'dark';
            await userToUpdate.save();
        } else {
            console.error('FAIL: Controller validation failed');
        }

        const updatedUser = await User.findById(user._id);
        if (updatedUser.theme === 'dark') {
            console.log('PASS: Theme updated to dark');
        } else {
            console.error('FAIL: Theme update failed', updatedUser.theme);
        }

        // 3. Simulate Update Theme (Light)
        console.log('3. Updating Theme to Light...');
        updatedUser.theme = 'light';
        await updatedUser.save();

        const finalUser = await User.findById(user._id);
        if (finalUser.theme === 'light') {
            console.log('PASS: Theme updated to light');
        } else {
            console.error('FAIL: Theme update failed');
        }

        console.log('Verification Complete');
        process.exit(0);

    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

verifyTheme();
