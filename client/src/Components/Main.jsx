import React, { useEffect, useState } from 'react';
import { Heart, MessageCircle, Send, HeartIcon } from "lucide-react";
import Cookies from "js-cookie";
import { jwtDecode } from 'jwt-decode';
import axios from "axios";

const Main = () => {
  const token = Cookies.get('token');
  let userId = null;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      userId = decoded.id;
    } catch (error) {
      console.error("Invalid token");
    }
  }

  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    const token = Cookies.get("token");
    try {
      const res = await axios.get("http://localhost:4000/api/v1/posts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPosts(res.data);
    } catch (error) {
      console.error("Failed to fetch posts:", error.response?.data || error.message);
    }
  };

  const handleLike = async (postId) => {
    const token = Cookies.get("token");
    try {
      const res = await axios.post(`http://localhost:4000/api/v1/posts/${postId}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchPosts(); // refetch posts or update state locally
    } catch (error) {
      console.error("Like failed:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className='main'>
      {/* <div className='stories'>
        <div>
          <img src="https://avatars.githubusercontent.com/u/97161064?v=4" />
          <span>Innobharat</span>
        </div>

        <div>
          <img src="https://avatars.githubusercontent.com/u/97161064?v=4" />
          <span>Innobharat</span>
        </div>

        <div>
          <img src="https://avatars.githubusercontent.com/u/97161064?v=4" />
          <span>Innobharat</span>
        </div>

        <div>
          <img src="https://avatars.githubusercontent.com/u/97161064?v=4" />
          <span>Innobharat</span>
        </div>

        <div>
          <img src="https://avatars.githubusercontent.com/u/97161064?v=4" />
          <span>Innobharat</span>
        </div>

        <div>
          <img src="https://avatars.githubusercontent.com/u/97161064?v=4" />
          <span>Innobharat</span>
        </div>

        <div>
          <img src="https://avatars.githubusercontent.com/u/97161064?v=4" />
          <span>Innobharat</span>
        </div>

        <div>
          <img src="https://avatars.githubusercontent.com/u/97161064?v=4" />
          <span>Innobharat</span>
        </div>

        <div>
          <img src="https://avatars.githubusercontent.com/u/97161064?v=4" />
          <span>Innobharat</span>
        </div>

        <div>
          <img src="https://avatars.githubusercontent.com/u/97161064?v=4" />
          <span>Innobharat</span>
        </div>

        <div>
          <img src="https://avatars.githubusercontent.com/u/97161064?v=4" />
          <span>Innobharat</span>
        </div>
      </div> */}

      <div className='posts' style={{ margin:'50px 0px' }}>
        {posts.map((post, index) => (
          <>
            <div className='post' key={index}>
              <div className='head'>
                <div className='left'>
                  <img
                    src={post.user?.profilePic || "https://avatars.githubusercontent.com/u/97161064?v=4"}
                    alt="User"
                  />
                  <span>{post.user?.username || "Unknown"} • 1w</span>
                </div>
                <div className='right'></div>
              </div>

              <div className='body'>
                {post.post.endsWith('.jpg') || post.post.endsWith('.png') || post.post.endsWith('.jpeg') || post.post.endsWith('.webp') ? (
                  <img
                    src={post.post}
                    alt="Post"
                    style={{ width: '100%', borderRadius: '10px' }}
                  />
                ) : (
                  <video
                    src={post.post}
                    controls
                    autoPlay
                    muted
                    loop
                    style={{ width: '400px', height: '500px', borderRadius: '10px' }}
                  >
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>

              <div className='footer'>
                {post.likes?.includes(userId) ? (
                  <HeartIcon
                    color="red"
                    fill="red"
                    onClick={() => handleLike(post._id)}
                    style={{ cursor: 'pointer' }}
                  />
                ) : (
                  <Heart
                    color="#ffffff"
                    onClick={() => handleLike(post._id)}
                    style={{ cursor: 'pointer' }}
                  />
                )}
                <span style={{ color: '#fff', marginLeft: 8 }}>{post.likes?.length || 0}</span>
                <MessageCircle color='#ffffff' style={{ marginLeft: '10px' }} />
                <Send color="#ffffff" style={{ marginLeft: '10px' }} />
                <div>
                  <p style={{ color: '#fff' }}>{post.title}</p>
                  <p style={{ color: '#999', fontSize: '14px' }}>{post.desc}</p>
                </div>
              </div>

            </div>
            <hr style={{ width: '45%', border: 'none', height: '1px', backgroundColor: '#262626' }} />
          </>
        ))}

      </div>
    </div>
  );
};

export default Main;

