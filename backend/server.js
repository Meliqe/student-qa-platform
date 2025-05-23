const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { csrfProtection, cookieMiddleware } = require('./middleware/csrf');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');
const http = require('http');
const socketIO = require('socket.io');
const socketAuth = require('./middleware/socketAuth');
const UserSession = require('./models/UserSession');
const path = require('path')
const galleryRoutes = require('./routes/gallery');
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
const visitRoutes = require('./routes/visit');
// Initialize app
const app = express();

const server = http.createServer(app); // WebSocket bu server üzerinden çalışacak

const io = socketIO(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  },
});
io.use(socketAuth);
io.on("connection", (socket) => {
  const userId = socket.user._id;
  if (userId) {
    UserSession.findOneAndUpdate(
      { user: userId },
      { isOnline: true },
      { upsert: true }
    ).exec();
  }

  socket.on("disconnect", () => {
    if (userId) {
      UserSession.findOneAndUpdate(
        { user: userId },
        { isOnline: false }
      ).exec();
    }
  });
});



// Body parser
app.use(express.json());

// Enable CORS
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

// CSRF Token endpoint
app.get('/api/csrf-token', cookieMiddleware, csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use('/api/gallery', galleryRoutes);

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/answers', answerRoutes);
app.use('/api/users', userRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/visit',visitRoutes);

// Error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor`);
});
