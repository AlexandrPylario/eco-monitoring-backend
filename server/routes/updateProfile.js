const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // твоя модель

// 🛡️ Middleware для перевірки токена
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "⛔ Токен відсутній" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "⛔ Невірний токен" });
  }
}

// 🔄 Оновлення профілю
router.put('/', authenticate, async (req, res) => {
  const { email, region } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { email, region },
      { new: true }
    );
    res.json({
      message: "✅ Профіль оновлено",
      email: user.email,
      region: user.region
    });
  } catch (err) {
    res.status(500).json({ message: "❌ Помилка при оновленні профілю", error: err.message });
  }
});

module.exports = router;
