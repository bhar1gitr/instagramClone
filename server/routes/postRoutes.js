const express = require('express');
const router = express.Router();
const { getPosts, CreatePost, UpdatePost, DeletePost, toggleLike } = require('../controllers/postController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/posts', getPosts);
router.post('/create', authMiddleware, CreatePost);
router.put('/update/:id', authMiddleware, UpdatePost);
router.delete('/delete/:id', authMiddleware, DeletePost);
router.post('/posts/:postId/like', authMiddleware, toggleLike);

module.exports = router;
