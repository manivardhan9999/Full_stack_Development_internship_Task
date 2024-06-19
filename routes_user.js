const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();
const JWT_SECRET = 'your_jwt_secret';

router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User({ username, passwordHash });

    await newUser.save();
    res.status(201).send('User registered');
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user || !(await user.comparePassword(password))) {
        return res.status(400).send('Invalid credentials');
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
});

module.exports = router;
