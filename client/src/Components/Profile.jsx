import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import Sidebar from './Siderbar';
import { useParams } from 'react-router-dom'; // ⬅️ Add this

const Profile = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);


  const fetchProfile = async () => {
    const token = Cookies.get('token');
    if (!token) return;

    const decoded = jwtDecode(token);
    setCurrentUserId(decoded.id);

    try {
      const res = await axios.get(`http://localhost:4000/api/v1/user/${decoded.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(res.data.user);
      setPosts(res.data.posts || []);

      // Check if current user is following this profile
      if (res.data.user.followers?.includes(decoded.id)) {
        setIsFollowing(true);
      } else {
        setIsFollowing(false);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };

  const handleFollow = async () => {
    const token = Cookies.get('token');
    if (!token || !user) return;

    try {
      const endpoint = isFollowing ? 'unfollow' : 'follow';
      await axios.post(
        `http://localhost:4000/api/v1/user/${user._id}/${endpoint}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setIsFollowing(!isFollowing);
      fetchProfile(); // Refresh
    } catch (err) {
      console.error(`Failed to ${isFollowing ? 'unfollow' : 'follow'}`, err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div className="layout">
      <Sidebar />
      <div className="profile-container">
        {user && (
          <div className="profile-header">
            <img
              className="profile-pic"
              src={user.profilePic || 'https://avatars.githubusercontent.com/u/97161064?v=4'}
              alt="Profile"
            />
            <div className="profile-info">
              <h2>{user.username}</h2>
              <p>{user.name}</p>
              {user._id !== currentUserId && (
                <button onClick={handleFollow}>
                  {isFollowing ? 'Unfollow' : 'Follow'}
                </button>
              )}
              <div className="profile-stats">
                <span>
                  <strong>{posts.length}</strong> posts
                </span>
                <span>
                  <strong>{user.followers?.length || 0}</strong> followers
                </span>
                <span>
                  <strong>{user.following?.length || 0}</strong> following
                </span>
              </div>
            </div>
          </div>
        )}
        <hr className="divider" />
        <div className="profile-posts">
          {posts.map((post, idx) => (
            <div key={idx} className="post-thumb">
              {post.post.endsWith('.mp4') || post.post.includes('video') ? (
                <video src={post.post} controls className="post-thumb-video" />
              ) : (
                <img src={post.post} alt="Post" className="post-thumb-img" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
