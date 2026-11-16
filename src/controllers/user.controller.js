const User = require('../models/User');

exports.getProfile = async (req, res) => {
    try {
        const userId = req.user.id || req.user.userId;
        const user = await User.findById(userId).select('-password');
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.id || req.user.userId;
        const updatedUser = await User.findByIdAndUpdate(userId, req.body, { new: true }).select('-password');
        res.status(200).json({ message: "Profile updated successfully", updatedUser });
    }
    catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

exports.followUser = async (req, res) => {
    try {
        const currentUserId = req.user.id || req.user.userId;
        const targetUserId = req.params.id;

        if (currentUserId === targetUserId) {
            return res.status(400).json({ message: "You can't follow yourself!" });
        }

        const targetUser = await User.findById(targetUserId);
        const currentUser = await User.findById(currentUserId);

        if (!targetUser) {
            return res.status(404).json({ message: "User not found" });
        }

        if (currentUser.following.includes(targetUserId)) {
            return res.status(400).json({ message: "You are already following this user" });
        }

        await User.findByIdAndUpdate(currentUserId, { $push: { following: targetUserId } });
        await User.findByIdAndUpdate(targetUserId, { $push: { followers: currentUserId } });

        res.status(200).json({ message: "User followed successfully!" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

exports.unfollowUser = async (req, res) => {
    try {
        const currentUserId = req.user.id || req.user.userId;
        const targetUserId = req.params.id;

        if (currentUserId === targetUserId) {
            return res.status(400).json({ message: "You can't unfollow yourself!" });
        }

        const targetUser = await User.findById(targetUserId);
        const currentUser = await User.findById(currentUserId);

        if (!targetUser) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!currentUser.following.includes(targetUserId)) {
            return res.status(400).json({ message: "You are not following this user" });
        }

        await User.findByIdAndUpdate(currentUserId, { $pull: { following: targetUserId } });
        await User.findByIdAndUpdate(targetUserId, { $pull: { followers: currentUserId } });

        res.status(200).json({ message: "User unfollowed successfully!" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

exports.searchUsers = async (req, res) => {
    try {
        const { query } = req.query;
        
        if (!query) {
            return res.status(400).json({ message: "Please provide a search query!" });
        }

        const users = await User.find({
            $or: [
                { username: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } }
            ]
        }).select('-password');

        res.status(200).json({
            count: users.length,
            users
        });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

exports.updateAccountSettings = async (req, res) => {
    try {
        const userId = req.user.id || req.user.userId;
        const { isPublic } = req.body;

        if (typeof isPublic !== 'boolean') {
            return res.status(400).json({ message: "isPublic must be a boolean value (true or false)" });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { isPublic },
            { new: true }
        ).select('-password');

        res.status(200).json({
            message: "Account settings updated successfully",
            isPublic: updatedUser.isPublic
        });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};