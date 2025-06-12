const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { Register, Login, getUserWithPosts, SearchProfile, Follow, Unfollow, getNotifications } = require('../controllers/userController');
const User = require('../models/User');

router.post('/register', Register);
router.post('/login', Login);
router.get('/user/:id', authMiddleware, getUserWithPosts);
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, '_id username');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/:id/follow', authMiddleware, Follow);

// Unfollow a user
router.post('/:id/unfollow', authMiddleware, Unfollow);

router.get('/search', authMiddleware, SearchProfile);
router.get('/notifications', authMiddleware, getNotifications);


module.exports = router;
