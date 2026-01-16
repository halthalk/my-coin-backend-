require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/User');

const app = express();
app.use(cors());
app.use(express.json());

// الاتصال بقاعدة البيانات
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.error('❌ MongoDB Error:', err));

// 1. تسجيل الدخول أو إنشاء مستخدم جديد (عند فتح اللعبة)
app.post('/api/auth', async (req, res) => {
    const { telegramId, firstName, username } = req.body;

    try {
        let user = await User.findOne({ telegramId });

        if (!user) {
            // مستخدم جديد
            user = new User({ telegramId, firstName, username });
            await user.save();
            console.log(`New user created: ${firstName}`);
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// 2. تحديث البيانات (Sync) - يتم استدعاؤه كل بضع ثوانٍ
app.post('/api/sync', async (req, res) => {
    const { telegramId, score, energy, upgrades, daily, walletAddress, isPremium } = req.body;

    try {
        await User.findOneAndUpdate(
            { telegramId },
            { 
                score, 
                energy, 
                upgrades, 
                daily, 
                walletAddress, 
                isPremium,
                lastSync: Date.now() 
            }
        );
        res.sendStatus(200);
    } catch (error) {
        res.status(500).json({ error: 'Sync error' });
    }
});

// تشغيل السيرفر
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
