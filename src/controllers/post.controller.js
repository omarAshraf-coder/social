const Post = require('../models/Post');

exports.createPost = async (req, res) => {
    try {
        const { content } = req.body;
        const authorId = req.user.id || req.user.userId || req.user;

        if (!content || !content.trim()) {
            return res.status(400).json({ message: 'Post content is required' });
        }

        const newPost = new Post({
            content: content.trim(),
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
        const authorId = req.user.id || req.user.userId || req.user;
        const posts = await Post.find({ author: authorId })
            .populate('author', 'email')
            .sort({ createdAt: -1 });

        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.getSinglePost = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id).populate('author', 'email');

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.status(200).json(post);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;
        const userId = (req.user.id || req.user.userId || req.user).toString();

        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (post.author.toString() !== userId) {
            return res.status(403).json({ message: 'Only the post owner can update their post' });
        }

        if (content && content.trim()) {
            post.content = content.trim();
        }

        await post.save();
        res.status(200).json({
            message: 'Post updated successfully!',
            post
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = (req.user.id || req.user.userId || req.user).toString();

        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (post.author.toString() !== userId) {
            return res.status(403).json({ message: 'Only the post owner can delete their post' });
        }

        await post.deleteOne();
        res.status(200).json({ message: 'Post deleted successfully!' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};