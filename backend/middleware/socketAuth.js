const jwt = require('jsonwebtoken');
const User = require('../models/User');

const socketAuth = async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("WebSocket: Token eksik"));
    }

    // JWT doğrulama
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new Error("WebSocket: Kullanıcı bulunamadı"));
    }

    // Kullanıcıyı socket'e ekle
    socket.user = user;
    console.log('✅ socket.user atandı:', user.name)
    next();
  } catch (err) {
    return next(new Error("WebSocket: Token geçersiz"));
  }
};

module.exports = socketAuth;
