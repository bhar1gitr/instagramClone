const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  username: String,
  email: { type: String, unique: true },
  password: String,
  profilePic: String,
  dob: String,
  posts: Array,
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  story: { type: Boolean, default: false },
  notifications: [
    {
      type: {
        type: String,
        enum: ['like', 'follow', 'comment'],
        required: true
      },
      fromUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', default: null },
      timestamp: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
