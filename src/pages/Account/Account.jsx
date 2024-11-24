import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Account.css';
import { decodeToken } from '../../utils/token';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import PostCard from '../Home/components/PostCard/PostCard';
import $api from '../../api';

const Account = () => {
    const [user, setUser] = useState(decodeToken(localStorage.getItem('token')));
    const [posts, setPosts] = useState([]);
    const [favourites, setFavourites] = useState([]);
    const [activeTab, setActiveTab] = useState('posts');
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ fullName: '', login: '' });

    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (user) fetchMe(user.id);
    }, []);

    useEffect(() => {
        const fetchUserPostData = async () => {
            try {
                const postsResponse = await $api.get(`/posts/${user.id}/posts`);

                setPosts(postsResponse.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        const fetchUserFavourites = async () => {
            try {
                const favouritesResponse = await $api.get(`/users/${user.id}/favourites`);
                setFavourites(favouritesResponse.data);
            } catch (error) {
                console.error('Error fetching user favourites:', error);
            }
        };

        fetchUserPostData();
        fetchUserFavourites();
    }, [user]);

    const fetchMe = async (userId) => {
        try {
            const response = await $api.get(`/users/${userId}`);
            if (response.status !== 200) throw new Error('Error fetching user info');
            const data = response.data;
            setUser(data);
            setFormData({ fullName: data.fullName, login: data.login });
            document.cookie = `fullName=${encodeURIComponent(data.fullName)}; path=/; max-age=86400`;
        } catch (err) {
            setError(err.message);
        }
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const handleLogout = async () => {
        try {
            const response = await $api.post(`/auth/logout`);
            if (response.status === 200) {
                localStorage.removeItem('token');
                navigate('/');
            } else {
                setError('Failed to log out');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const handleImageChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await $api.patch('/users/avatar', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.status === 200) {
                const data = response.data;
                setUser(data.user);
            } else {
                setError('Failed to update profile picture');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const isValidUrl = (string) => {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    };

    const handleImageClick = () => {
        fileInputRef.current.click(); // Trigger file input dialog
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSaveChanges = async () => {
        try {
            const response = await $api.patch(`/users/${user.id}`, formData);
            if (response.status === 200) {
                setUser({ ...user, ...formData });
                setIsEditing(false);
            } else {
                setError('Failed to update user information');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    if (error) {
        return <p>Error: {error}</p>;
    }

    if (!user) {
        return <p>Loading...</p>;
    }

    return (
        <>
            <Header hideAuthorizationButtons={true} />
            <div className='container'>
                <div className="account-page container">
                    <h1>Account Information</h1>
                    <div className="profile-container">
                        <div className="profile-picture" onClick={handleImageClick} style={{ cursor: 'pointer' }}>
                            <img
                                src={isValidUrl(user.profilePicture)
                                    ? user.profilePicture
                                    : `${process.env.REACT_APP_BACK_URL_IMG}/${user.profilePicture}`}
                                alt="Profile"
                            />
                            <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                onChange={handleImageChange}
                            />
                        </div>
                        <div className="profile-details">
                            {isEditing ? (
                                <div className='edit-information'>
                                    <p>
                                        <strong>Full Name</strong>
                                    </p>
                                    <input
                                        className='fullName-input'
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                    />
                                    <p>
                                        <strong>Login</strong>
                                    </p>
                                    <input
                                        className='login-input'
                                        type="text"
                                        name="login"
                                        value={formData.login}
                                        onChange={handleInputChange}
                                    />
                                    <div className='buttons-edit'>
                                        <button onClick={handleSaveChanges} className="btn btn-success save-changes-btn">
                                            Save Changes
                                        </button>
                                        <button onClick={handleEditToggle} className="btn btn-secondary">
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <p>
                                        <strong>Full Name:</strong> {user.fullName}
                                    </p>
                                    <p>
                                        <strong>Login:</strong> {user.login}
                                    </p>
                                    <p>
                                        <strong>Email:</strong> {user.email}
                                    </p>
                                    <p>
                                        <strong>Rating:</strong> {user.rating}
                                    </p>
                                    <button onClick={handleEditToggle} className="btn btn-primary">
                                        Edit Information
                                    </button>
                                </>
                            )}
                        </div>
                        <button onClick={handleLogout} className="btn btn-danger">
                            Log Out
                        </button>
                    </div>
                </div>
                <div className="tabs">
                    <button
                        className={`tab-button ${activeTab === 'posts' ? 'active' : ''}`}
                        onClick={() => handleTabChange('posts')}
                    >
                        Posts
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'favourites' ? 'active' : ''}`}
                        onClick={() => handleTabChange('favourites')}
                    >
                        Favourites
                    </button>
                </div>
                <div className="content">
                    {activeTab === 'posts' && posts.length > 0 ? (
                        <div className="row">
                            {posts.map((post) => (
                                <PostCard key={post.id} post={post} />
                            ))}
                        </div>
                    ) : activeTab === 'favourites' && favourites.length > 0 ? (
                        <div className="row">
                            {favourites.map((post) => (
                                <PostCard key={post.id} post={post} />
                            ))}
                        </div>
                    ) : (
                        <p>No content available.</p>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Account;
