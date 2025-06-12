const express = require('express');
const router = express.Router();
const { sendMessage, getMessages } = require('../controllers/messageController');


// POST: Send message
router.post('/message', sendMessage);

// GET: Fetch messages between two users
router.get('/messages/:user1/:user2', getMessages);
// router.get('/messages/:user1/:user2', async (req, res) => {
//   const { user1, user2 } = req.params;

//   try {
//     const messages = await Message.find({
//       $or: [
//         { sender: user1, receiver: user2 },
//         { sender: user2, receiver: user1 },
//       ]
//     }).sort({ createdAt: 1 }); // Oldest first
//     res.json(messages);
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to fetch messages' });
//   }
// });

module.exports = router;
