const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: String,
    desc: String,
    post: String,
    shares: Number,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);
