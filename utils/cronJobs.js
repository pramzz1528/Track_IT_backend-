const cron = require('node-cron');
// Import models or services if needed for cron jobs
// const User = require('../models/User');

const startCronJobs = () => {
    // Example: Run every day at midnight to mark absent
    cron.schedule('0 0 * * *', () => {
        console.log('Running daily attendance check...');
        // Logic to check who hasn't checked in and mark as Absent
    });
};

module.exports = startCronJobs;
