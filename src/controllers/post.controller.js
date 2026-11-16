const Post = require('../models/Post');

exports.createPost = async (req, res) => {
    try {
        const { content } = req.body;

        const authorId = req.user.id || req.user.userId || req.user;

        const newPost = new Post({
            content,
            author: authorId 
        });

        await newPost.save();
        res.status(201).json({
            message: 'Post created successfully!',
            post: newPost
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.getPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate('author', 'email');
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};