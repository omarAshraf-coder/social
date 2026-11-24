const Comment = require('../models/Comment');
const Post = require('../models/Post');

const getUserId = (user) => (user.userId || user.id || user._id).toString();

exports.createComment = async (req, res) => {
  try {
    const { content } = req.body;
    const { postId } = req.params;
    const userId = getUserId(req.user);

    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Comment content is required' });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = await Comment.create({
      content: content.trim(),
      post: postId,
      author: userId,
    });

    const populatedComment = await comment.populate('author', 'username name');
    res.status(201).json({ message: 'Comment created', comment: populatedComment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPostComments = async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.find({ post: postId })
      .populate('author', 'username name')
      .sort({ createdAt: -1 });

    res.status(200).json({ count: comments.length, comments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSingleComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId).populate('author', 'username name');
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    res.status(200).json({ comment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;
    const userId = getUserId(req.user);

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.author.toString() !== userId) {
      return res.status(403).json({ message: 'Only the comment owner can update this comment' });
    }

    if (content && content.trim()) {
      comment.content = content.trim();
    }

    await comment.save();
    res.status(200).json({ message: 'Comment updated', comment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = getUserId(req.user);

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const post = await Post.findById(comment.post);
    const isCommentOwner = comment.author.toString() === userId;
    const isPostOwner = post && post.author.toString() === userId;

    if (!isCommentOwner && !isPostOwner) {
      return res.status(403).json({
        message: 'Only the comment owner or the post owner can delete this comment',
      });
    }

    await comment.deleteOne();
    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};