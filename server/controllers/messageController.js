const Message = require('../models/Message');

// Send a message
const sendMessage = async (req, res) => {
  const { sender, receiver, message } = req.body;
  try {
    const newMsg = await Message.create({ sender, receiver, message });
    // console.log(newMsg);
    res.status(201).json(newMsg);
  } catch (err) {
    res.status(500).json({ error: 'Failed to send message' });
  }
};

// Get messages between two users
const getMessages = async (req, res) => {
  const { user1, user2 } = req.params;
  try {
    const messages = await Message.find({
      $or: [
        { sender: user1, receiver: user2 },
        { sender: user2, receiver: user1 }
      ]
    }).sort({ timestamp: 1 });

    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

module.exports = { sendMessage, getMessages };
