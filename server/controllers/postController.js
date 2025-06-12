const Post = require('../models/Post');
const User = require('../models/User');

const getPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .sort({ createdAt: -1 });
        // console.log(posts)
        res.status(200).json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ error: 'Server error fetching posts' });
    }
};

// Create Post
const CreatePost = async (req, res) => {
    const { post, title, desc } = req.body;
    const userId = req.user.id; // comes from auth middleware

    try {
        const newPost = new Post({ post, title, desc, userId });
        await newPost.save();
        res.status(201).json({ message: 'Post created successfully', newPost });
    } catch (error) {
        res.status(500).json({ error: 'Error creating post' });
    }
};

// Update Post
const UpdatePost = async (req, res) => {
    const { post, title, desc } = req.body;
    const postId = req.params.id;
    const userId = req.user.id;

    try {
        const existingPost = await Post.findById(postId);
        if (!existingPost) return res.status(404).json({ error: 'Post not found' });

        if (existingPost.userId.toString() !== userId)
            return res.status(403).json({ error: 'Unauthorized to update this post' });

        existingPost.post = post || existingPost.post;
        existingPost.title = title || existingPost.title;
        existingPost.desc = desc || existingPost.desc;

        await existingPost.save();

        res.status(200).json({ message: 'Post updated successfully', existingPost });
    } catch (error) {
        res.status(500).json({ error: 'Error updating post' });
    }
};

// Delete Post
const DeletePost = async (req, res) => {
    const postId = req.params.id;
    const userId = req.user.id;

    try {
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ error: 'Post not found' });

        if (post.userId.toString() !== userId)
            return res.status(403).json({ error: 'Unauthorized to delete this post' });

        await Post.findByIdAndDelete(postId);
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting post' });
    }
};

const toggleLike = async (req, res) => {
    const { postId } = req.params;
    const userId = req.user.id;

    try {
        const post = await Post.findById(postId);

        if (!post) return res.status(404).json({ error: 'Post not found' });

        const alreadyLiked = post.likes.includes(userId);

        if (alreadyLiked) {
            post.likes.pull(userId);
        } else {
            post.likes.push(userId);

            // ✅ Add notification to post owner (if not liking own post)
            if (post.userId && post.userId.toString() !== userId) {
                const owner = await User.findById(post.userId);

                owner.notifications.push({
                    type: 'like',
                    fromUser: userId,
                    post: post._id,
                    timestamp: new Date()
                });

                await owner.save();
            }
        }

        await post.save();

        res.status(200).json({ message: alreadyLiked ? 'Unliked' : 'Liked' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error toggling like' });
    }
};

const comments = async (req, res) => {
    
}

module.exports = { getPosts, CreatePost, UpdatePost, DeletePost, toggleLike };
