import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import Sidebar from './Siderbar';
import { useNavigate } from 'react-router-dom';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const navigate = useNavigate();

    const fetchNotifications = async () => {
        const token = Cookies.get('token');
        if (!token) return;

        try {
            const res = await axios.get('http://localhost:4000/api/v1/notifications', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setNotifications(res.data.notifications || []);
        } catch (err) {
            console.error('Failed to load notifications', err);
        }
    };

    const handleRedirect = (notification) => {
        navigate(`/profile/${notification.fromUser._id}`);
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    return (
        <div className="layout">
            <Sidebar />
            <div className="notification-container">
                <h2 className="notification-heading">Notifications</h2>

                {notifications.length === 0 ? (
                    <p className="no-notification">No notifications yet.</p>
                ) : (
                    <div className="notification-list">
                        {notifications.map((n, index) => (
                            <div
                                key={index}
                                onClick={() => handleRedirect(n)}
                                className="notification-card"
                            >
                                {n.type === 'follow' && (
                                    <p><strong>{n.fromUser?.username}</strong> started following you.</p>
                                )}
                                {n.type === 'like' && (
                                    <p><strong>{n.fromUser?.username}</strong> liked your post.</p>
                                )}
                                {n.type === 'comment' && (
                                    <p><strong>{n.fromUser?.username}</strong> commented on your post.</p>
                                )}
                                <small className="notification-date">
                                    {new Date(n.timestamp).toLocaleString()}
                                </small>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notifications;
