const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const verifyToken = require('../middleware/auth.middleware'); 

router.post('/register', authController.register);

router.post('/login', authController.login);

router.post('/refresh-token', authController.refreshToken);

router.get('/profile', verifyToken, (req, res) => {
    res.status(200).json({
        message: "Welcome to your profile! You are authenticated successfully.",
        userId: req.user.userId
    });
});

module.exports = router;