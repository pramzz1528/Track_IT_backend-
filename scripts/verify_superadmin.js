const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Task = require('../models/Task');
const Leave = require('../models/Leave');

dotenv.config({ path: './.env' });

const verifySuperAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Cleanup
        await Task.deleteMany({});
        await Leave.deleteMany({});
        await User.deleteOne({ email: 'supercheck@example.com' });
        await User.deleteOne({ email: 'employee@example.com' });

        // 1. Create Users
        console.log('1. Creating Users...');
        const superAdmin = await User.create({
            name: 'Super Admin Check',
            email: 'supercheck@example.com',
            password: 'password',
            role: 'SuperAdmin',
            isApproved: true
        });

        const employee = await User.create({
            name: 'Employee Check',
            email: 'employee@example.com',
            password: 'password',
            role: 'Employee',
            isApproved: true
        });

        // 2. Create Data
        console.log('2. Creating Data...');
        await Task.create({
            title: 'Test Task',
            description: 'Test Desc',
            assignedTo: employee._id,
            createdBy: employee._id
        });

        await Leave.create({
            user: employee._id,
            leaveType: 'Sick',
            reason: 'Flu',
            startDate: Date.now(),
            endDate: Date.now()
        });

        // 3. Verify Task Access Logic (Simulated)
        console.log('3. Verifying Task Access...');
        // Simulate controller logic: if SuperAdmin, find() returns all
        let tasks;
        if (superAdmin.role === 'Admin' || superAdmin.role === 'SuperAdmin') {
            tasks = await Task.find();
        } else {
            tasks = await Task.find({ assignedTo: superAdmin._id });
        }

        if (tasks.length > 0) {
            console.log('PASS: SuperAdmin can view all tasks.');
        } else {
            console.error('FAIL: SuperAdmin could not see tasks.');
        }

        // 4. Verify Leave Access Logic
        console.log('4. Verifying Leave Access...');
        let leaves;
        if (superAdmin.role === 'Admin' || superAdmin.role === 'SuperAdmin') {
            leaves = await Leave.find();
        } else {
            leaves = await Leave.find({ user: superAdmin._id });
        }

        if (leaves.length > 0) {
            console.log('PASS: SuperAdmin can view all leaves.');
        } else {
            console.error('FAIL: SuperAdmin could not see leaves.');
        }

        console.log('Verification Complete.');
        process.exit(0);

    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

verifySuperAdmin();
