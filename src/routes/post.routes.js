const express = require('express');
const router = express.Router();
const postController = require('../controllers/post.controller');
const verifyToken = require('../middleware/auth.middleware');

router.post('/', verifyToken, postController.createPost);

router.get('/', postController.getPosts);

module.exports = router;