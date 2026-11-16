const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const verifyToken = require('../middleware/auth.middleware');

router.get('/profile', verifyToken, userController.getProfile);
router.put('/profile', verifyToken, userController.updateProfile);

router.put('/settings', verifyToken, userController.updateAccountSettings);

router.get('/search', verifyToken, userController.searchUsers);

router.post('/follow/:id', verifyToken, userController.followUser);
router.post('/unfollow/:id', verifyToken, userController.unfollowUser);

module.exports = router;