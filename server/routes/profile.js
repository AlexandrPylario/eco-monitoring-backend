const express = require("express");
const router = express.Router();
const User = require("../models/user");
const auth = require("../middleware/auth");

router.get("/", auth, async (req, res) => {
  try {
    console.log("🔐 Дані з токена:", req.user);
const user = await User.findById(req.user.id).select("email region address role");

    if (!user) return res.status(404).json({ message: "Користувача не знайдено" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Помилка сервера" });
  }
});
// PUT /api/profile/update
router.put("/update", auth, async (req, res) => {
  try {
    const { email, region } = req.body;
    const userId = req.user.id;

    if (!email || !region) {
      return res.status(400).json({ message: "Email і Регіон обов’язкові" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { email, region },
      { new: true }
    ).select("email region");

    res.json({
      message: "Профіль успішно оновлено",
      email: updatedUser.email,
      region: updatedUser.region,
    });
  } catch (err) {
    console.error("❌ Помилка оновлення профілю:", err);
    res.status(500).json({ message: "Помилка сервера" });
  }
});

module.exports = router;

// PUT /api/profile/update
router.put("/update", auth, async (req, res) => {
  try {
    const { email, region } = req.body;
    const userId = req.user.id;

    if (!email || !region) {
      return res.status(400).json({ message: "Email і Регіон обов’язкові" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { email, region },
      { new: true }
    ).select("email region");

    res.json({
      message: "Профіль успішно оновлено",
      email: updatedUser.email,
      region: updatedUser.region,
    });
  } catch (err) {
    console.error("❌ Помилка оновлення профілю:", err);
    res.status(500).json({ message: "Помилка сервера" });
  }
});
