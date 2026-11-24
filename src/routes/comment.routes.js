const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/post/:postId', authMiddleware, commentController.createComment);

router.get('/post/:postId', commentController.getPostComments);

router.get('/:commentId', commentController.getSingleComment);

router.put('/:commentId', authMiddleware, commentController.updateComment);
router.patch('/:commentId', authMiddleware, commentController.updateComment);

router.delete('/:commentId', authMiddleware, commentController.deleteComment);

module.exports = router;