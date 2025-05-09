const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { csrfProtection, cookieMiddleware } = require('./middleware/csrf');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');


// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Route files
const authRoutes = require('./routes/auth');
const questionRoutes = require('./routes/questions');
const answerRoutes = require('./routes/answers');
const userRoutes = require('./routes/users');
const announcementRoutes = require('./routes/announcements');
const statsRoutes = require('./routes/stats');

// Initialize app
const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:4200',
  credentials: true
}));

// CSRF Token endpoint
app.get('/api/csrf-token', cookieMiddleware, csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/answers', answerRoutes);
app.use('/api/users', userRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/stats', statsRoutes);


// Error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
