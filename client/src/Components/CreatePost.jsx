import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import axios from 'axios';

import Sidebar from "./Siderbar"

const CreatePost = () => {
    const [form, setForm] = useState({
        post: '',
        title: '',
        desc: '',
    });

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

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token =  Cookies.get("token");
        const payload = {
            ...form,
            userId,
        };
        try {
            const res = await axios.post('http://localhost:4000/api/v1/create', payload, {
                headers: {
                    Authorization: `Bearer ${token}`, 
                },
            });
               toast.success("Post Created");
        } catch (error) {
            console.error('Error creating post:', error.response?.data || error.message);
        }
    };

    return (

        <div className='layout'>
            <Sidebar />
            <div className='container'>
                <div className="post-box">
                    <h2 className="heading" style={{ color:'white' }}>Create New Post</h2>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="url"
                            name="post"
                            placeholder="Paste image/reel URL"
                            value={form.post}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="text"
                            name="title"
                            placeholder="Title"
                            value={form.title}
                            onChange={handleChange}
                            required
                        />
                        <textarea
                            name="desc"
                            placeholder="Description"
                            value={form.desc}
                            onChange={handleChange}
                            rows="3"
                        />
                        <button type="submit">Post</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreatePost;
