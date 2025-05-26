console.log("🚀 Сервер запускається...");
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
dotenv.config();

console.log("🔐 JWT_SECRET із .env:", process.env.JWT_SECRET);
 
const cors = require('cors');

const Report = require('./server/models/report');
const profileRoute = require('./server/routes/profile'); 

const app = express();
app.use(express.json());
app.use(cors());
app.use('/api/profile', profileRoute);


// Підключення до MongoDB
setTimeout(() => {
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => console.log('✅ MongoDB connected'))
    .catch(err => console.error('❌ MongoDB error:', err));
}, 3000); // 3 секунди затримки

const User = require('./server/models/user'); 



// Реєстрація
app.post('/api/register', async (req, res) => {
  try {
    console.log("🔥 req.body:", req.body); // ← Додай сюди!

    const { email, password, region } = req.body;
    console.log("📥 Запит на реєстрацію:", req.body); // Можеш залишити також

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Користувач вже існує' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, region });
    await user.save();

    res.status(201).json({ message: 'Реєстрація успішна' });
  } catch (err) {
    console.error("❌ Помилка під час реєстрації:", err.message);
    res.status(500).json({
      message: 'Помилка сервера при реєстрації',
      error: err.message
    });
  }
});



// Вхід
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Неправильний email або пароль' });
  }

 const token = jwt.sign(
  {
    userId: user._id,
    email: user.email,
    region: user.region,
    address: user.address,
    role: user.role
  },
  process.env.JWT_SECRET,
  { expiresIn: '1d' }
);

  res.json({ token });
});

// Сповіщення (імітація)
app.get('/api/alert', async (req, res) => {
  const { region } = req.query;
  if (region === 'Київ') {
    res.json({ message: '⚠️ Високий рівень забруднення повітря в Києві!' });
  } else {
    res.json({ message: '✅ Все спокійно у вашому регіоні' });
  }
});

// Додавання нового сповіщення
app.post('/api/report', async (req, res) => {
  try {
    const { type, description } = req.body;
    const newReport = new Report({ type, description });
    await newReport.save();

    res.status(201).json({ message: 'Сповіщення успішно надіслано!' });
  } catch (err) {
    console.error("❌ Помилка при збереженні сповіщення:", err.message);
    res.status(500).json({ message: 'Помилка сервера при додаванні сповіщення' });
  }
});

// Запуск
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`🌍 Сервер запущено на порту ${PORT}`));
