const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');
const os = require('os');

// Load env vars
dotenv.config();

const app = express();

/* =========================
   ✅ CORS CONFIG (FINAL)
========================= */

const allowedOrigins = [
  'https://trackit-f1c22.web.app',
  'https://trackit-f1c22.firebaseapp.com',
  'http://localhost:3000',
  'http://localhost:5173'
];

// Also allow extra origins from Render ENV (optional)
if (process.env.FRONTEND_URL) {
  process.env.FRONTEND_URL.split(',').forEach(url => {
    allowedOrigins.push(url.trim());
  });
}

app.use(cors({
  origin: function (origin, callback) {
    // Allow Postman / curl / mobile apps
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.error('❌ CORS BLOCKED:', origin);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

// 🔥 REQUIRED FOR RENDER PREFLIGHT
app.options('*', cors());

/* =========================
   MIDDLEWARE
========================= */

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());
app.use(morgan('dev'));

/* =========================
   ROUTES
========================= */

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/leaves', require('./routes/leaveRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

/* =========================
   ERROR HANDLER
========================= */

app.use(require('./middleware/errorMiddleware'));

/* =========================
   SERVER START
========================= */

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

connectDB().then(() => {
  const server = app.listen(PORT, () => {
    const localIp = getLocalIp();
    console.log(`\n🚀 Server running on port ${PORT}`);
    console.log(`> Local:   http://localhost:${PORT}`);
    console.log(`> Network: http://${localIp}:${PORT}`);
    console.log(`> Allowed Origins:\n${allowedOrigins.join('\n')}\n`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`❌ Port ${PORT} already in use`);
      process.exit(1);
    } else {
      console.error(err);
    }
  });

  process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
    server.close(() => process.exit(1));
  });
});
