const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    telegramId: { type: String, required: true, unique: true },
    firstName: String,
    username: String,
    score: { type: Number, default: 0 },
    energy: { type: Number, default: 1000 },
    maxEnergy: { type: Number, default: 1000 },
    tapValue: { type: Number, default: 1 },
    regenRate: { type: Number, default: 1 },
    isPremium: { type: Boolean, default: false },
    walletAddress: { type: String, default: null },
    
    // لتخزين الترقيات (Upgrades)
    upgrades: {
        multitap: { type: Number, default: 1 },
        energy: { type: Number, default: 1 },
        speed: { type: Number, default: 1 },
        bot: { type: Number, default: 0 }
    },
    
    // للمهام اليومية
    daily: {
        streak: { type: Number, default: 0 },
        lastClaim: { type: Number, default: 0 }
    },

    lastSync: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
