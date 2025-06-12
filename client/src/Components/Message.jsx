import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Sidebar from "./Siderbar";

const socket = io('http://localhost:4000', {
  withCredentials: true,
  transports: ['websocket', 'polling'],
});

const Chat = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const token = Cookies.get('token');
    const decoded = jwtDecode(token);
    setUserId(decoded.id);
    socket.emit('join', decoded.id);

    socket.on('receiveMessage', (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    axios.get('http://localhost:4000/api/v1/users').then((res) => {
      setUsers(res.data.filter((u) => u._id !== userId));
    });
  }, [userId]);

  const sendMessage = () => {
    if (!selectedUser || !message.trim()) return;

    const msgObj = {
      sender: userId,
      receiver: selectedUser._id,
      message,
    };

    socket.emit('sendMessage', msgObj);
    axios.post('http://localhost:4000/api/v1/message', msgObj);

    setMessages((prev) => [...prev, { ...msgObj, timestamp: Date.now() }]);
    setMessage('');
  };

  useEffect(() => {
    if (!selectedUser) return;

    axios
      .get(`http://localhost:4000/api/v1/messages/${userId}/${selectedUser._id}`)
      .then((res) => {
        setMessages(res.data);
      });
  }, [selectedUser, userId]);

  const handleProfileClick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  return (

    <div className='layout'>
      <Sidebar />
      <div className="chat-container">
        <div className="user-list">
          <h4>Users</h4>
          {users.map((user) => (
            <div
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`user-item ${selectedUser?._id === user._id ? 'active' : ''}`}
            >
              {user.username}
            </div>
          ))}
        </div>

        <div className="chat-window">
          {selectedUser ? (
            <>
              <div className="chat-header">Chat with <span style={{ cursor:'pointer' }} onClick={ ()=> handleProfileClick(selectedUser._id) }>{selectedUser.username}</span></div>
              <div className="message-list">
                {messages
                  .filter(
                    (msg) =>
                      (msg.sender === userId && msg.receiver === selectedUser._id) ||
                      (msg.sender === selectedUser._id && msg.receiver === userId)
                  )
                  .map((msg, idx) => (
                    <div
                      key={idx}
                      className={`message-item ${msg.sender === userId ? 'you' : 'them'}`}
                    >
                      {msg.message}
                    </div>
                  ))}

              </div>
              <div className="message-input">
                <input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                />
                <button onClick={sendMessage}>Send</button>
              </div>
            </>
          ) : (
            <p>Select a user to start chatting.</p>
          )}
        </div>
      </div>
    </div>

  );
};

export default Chat;
