const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashedPassword });
        await user.save();
        res.status(201).json({
            message: "User registered successfully!",
            userId: user._id
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const accessToken = jwt.sign(
            { userId: user._id },
            'access_secret_key_123',
            { expiresIn: '15m' }
        );

        const refreshToken = jwt.sign(
            { userId: user._id },
            'refresh_secret_key_123',
            { expiresIn: '7d' }
        );

        res.status(200).json({
            message: 'Login successful!',
            accessToken,
            refreshToken
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const refreshToken = async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) {
            return res.status(401).json({ message: 'Refresh Token required' });
        }

        jwt.verify(token, 'refresh_secret_key_123', (err, user) => {
            if (err) {
                return res.status(403).json({ message: 'Invalid or expired Refresh Token' });
            }

            const newAccessToken = jwt.sign(
                { userId: user.userId },
                'access_secret_key_123',
                { expiresIn: '15m' }
            );

            res.status(200).json({
                accessToken: newAccessToken
            });
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    register,
    login,
    refreshToken
};