const User = require('../models/User');
const Post = require('../models/Post');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Register = async (req, res) => {
    const { name, username, email, password, dob } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            username,
            email,
            password: hashedPassword,
            dob
        });

        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Server error during registration' });
    }
};

const Login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                username: user.username,
                profilePic: user.profilePic
            }
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error during login' });
    }
};

const getUserWithPosts = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ error: "User not found" });

    const posts = await Post.find({ userId: user._id }).sort({ createdAt: -1 });

    res.status(200).json({ user, posts });
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ error: "Server error fetching profile" });
  }
};

const SearchProfile = async (req, res) => {
    const query = req.query.query;

    if (!query) {
        return res.status(400).json({ message: 'Query parameter is required' });
    }

    try {
        const users = await User.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } }
            ]
        }).select('_id name email');

        res.json({ users });
    } catch (err) {
        console.error('Search error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const Follow = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    const targetUser = await User.findById(req.params.id);

    if (!targetUser || !currentUser) return res.status(404).json({ message: 'User not found' });

    if (!targetUser.followers.includes(currentUser._id)) {
      targetUser.followers.push(currentUser._id);
      currentUser.following.push(targetUser._id);

      // ✅ Add follow notification
      targetUser.notifications.push({
        type: 'follow',
        fromUser: currentUser._id,
      });

      await targetUser.save();
      await currentUser.save();

      return res.status(200).json({ message: 'Followed successfully' });
    } else {
      return res.status(400).json({ message: 'Already following' });
    }
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const Unfollow = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    const targetUser = await User.findById(req.params.id);

    if (!targetUser || !currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (targetUser.followers.includes(currentUser._id)) {
      targetUser.followers.pull(currentUser._id);
      currentUser.following.pull(targetUser._id);

      await targetUser.save();
      await currentUser.save();

      res.status(200).json({ message: 'Unfollowed successfully' });
    } else {
      res.status(400).json({ message: 'Not following the user' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getNotifications = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('notifications.fromUser', 'username profilePic')
      .populate('notifications.post', '_id');

    res.status(200).json({ notifications: user.notifications.reverse() });
  } catch (err) {
    res.status(500).json({ message: 'Failed to load notifications' });
  }
};


module.exports = { Register, Login, getUserWithPosts, SearchProfile, Follow, Unfollow, getNotifications }