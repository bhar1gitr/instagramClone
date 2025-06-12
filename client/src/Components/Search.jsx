import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Siderbar';

const Search = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const navigate = useNavigate();

    const handleSearch = async () => {
        const token = Cookies.get('token');
        if (!token) return;
        if (!query.trim()) return;
        try {
            const res = await axios.get(`http://localhost:4000/api/v1/search?query=${query}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setResults(res.data.users || []);
        } catch (err) {
            console.error('Search failed:', err);
        }
    };

    const handleProfileClick = (userId) => {
        navigate(`/profile/${userId}`);
    };

    return (
        <div className="layout">
            <Sidebar />
            <div className="search-container">
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="search-input"
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <button
                        onClick={handleSearch}
                        className="search-button"
                    >
                        Search
                    </button>
                </div>

                {results.length > 0 && (
                    <div className="results-container">
                        {results.map((user) => (
                            <div
                                key={user._id}
                                className="result-card"
                                onClick={() => handleProfileClick(user._id)}
                            >
                                <p className="result-name">{user.name}</p>
                                <p className="result-email">{user.email}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Search;
