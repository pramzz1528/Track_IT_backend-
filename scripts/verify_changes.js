const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config({ path: './.env' });

const verify = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // cleanup test user
        await User.deleteOne({ email: 'verify@example.com' });

        // 1. Create User
        console.log('1. Creating user with plain text password...');
        const user = await User.create({
            name: 'Verify User',
            email: 'verify@example.com',
            password: 'plainpassword123',
            role: 'Employee'
        });

        // 2. Verify Database Content
        console.log('2. Verifying database content...');
        // We go behind the scenes to check the raw document
        const storedUser = await mongoose.connection.collection('users').findOne({ _id: user._id });

        if (storedUser.password === 'plainpassword123') {
            console.log('PASS: Password stored as plain text.');
        } else {
            console.error('FAIL: Password is NOT plain text:', storedUser.password);
        }

        if (storedUser.theme === 'light') {
            console.log('PASS: Default theme is light.');
        } else {
            console.error('FAIL: Default theme is incorrect:', storedUser.theme);
        }

        // 3. Test matchPassword
        console.log('3. Testing matchPassword method...');
        // Re-fetch document via Mongoose to stick methods
        const mongooseUser = await User.findById(user._id).select('+password');
        const isMatch = await mongooseUser.matchPassword('plainpassword123');
        if (isMatch) {
            console.log('PASS: matchPassword returned true for correct password.');
        } else {
            console.error('FAIL: matchPassword returned false for correct password.');
        }

        // 4. Test Theme Update (Simulate via Mongoose since we don't have a full running server for HTTP test easily in script, 
        // but verifying the model update works is sufficient for this level)
        console.log('4. Testing theme update...');
        const updatedUser = await User.findByIdAndUpdate(user._id, { theme: 'dark' }, { new: true });
        if (updatedUser.theme === 'dark') {
            console.log('PASS: User theme updated to dark.');
        } else {
            console.error('FAIL: User theme failed to update.');
        }

        console.log('Verification Complete.');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

verify();
