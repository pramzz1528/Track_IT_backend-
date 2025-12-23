const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');
const path = require('path');
const os = require('os');

// Load env vars
dotenv.config();

// Connect to database
// Database connection handled before server startup

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Enhanced CORS Configuration
const allowedOrigins = process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',') : [];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        // Check if origin is allowed
        if (process.env.NODE_ENV === 'development' || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

app.use(helmet());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/leaves', require('./routes/leaveRoutes'));
app.use("/api/users", require("./routes/userRoutes"));
// Error Handler
app.use(require('./middleware/errorMiddleware'));

const PORT = process.env.PORT || 5000;

const getLocalIp = () => {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return 'localhost';
};

// Connect to database and start server
connectDB().then(() => {
    const server = app.listen(PORT, () => {
        const localIp = getLocalIp();
        console.log(`\nServer running in ${process.env.NODE_ENV} mode on port ${PORT}`);
        console.log(`> Local:   http://localhost:${PORT}`);
        console.log(`> Network: http://${localIp}:${PORT}`);
        console.log(`> Allowed Origins: ${allowedOrigins.join(', ') || 'None'}\n`);
    });

    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.error(`\n\x1b[31mCRITICAL ERROR: Port ${PORT} is ALREADY IN USE by another application.\x1b[0m`);
            console.error(`\x1b[33mAction Required: Close other terminals running the server or stop the process on port ${PORT}.\x1b[0m`);
            console.error(`To fix automatically, running 'npm run dev' should normally handle this, but if you have multiple terminals open, they will fight each other.\n`);
            process.exit(1);
        } else {
            console.error(err);
        }
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err, promise) => {
        console.log(`\x1b[31mError: ${err.message}\x1b[0m`);
        console.error(err.stack); // Log full stack trace
        // Close server & exit process
        server.close(() => process.exit(1));
    });
});
