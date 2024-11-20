import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import PostCard from '../Home/components/PostCard/PostCard';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import $api from '../../api';
import { decodeToken } from '../../utils/token'; // Assuming you have this utility
import './UserPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const UserPage = () => {
    const navigate = useNavigate();
    const { userId } = useParams();

    const token = localStorage.getItem('token');
    const decodedUser = token ? decodeToken(token) : null;

    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchUserPostData = async () => {
            try {
                const userResponse = await $api.get(`/users/${userId}`);
                const postsResponse = await $api.get(`/posts/${userId}/posts`);

                setUser(userResponse.data);
                setPosts(postsResponse.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserPostData();
    }, [userId]);

    const isValidUrl = (string) => {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    };

    const handleDeleteUser = async () => {
        try {
            const response = await $api.delete(`/users/${userId}`);

            if (response.status === 200) navigate('/');
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Failed to delete user.');
        }

    };

    return (
        <div className="section">
            <Header />
            <div className="container">
                {user && (
                    <div className="user-card user-card-container">
                        <img
                            src={isValidUrl(user.profilePicture)
                                ? user.profilePicture
                                : `${process.env.REACT_APP_BACK_URL_IMG}/${user.profilePicture}`}
                            alt={`${user.login}'s Profile`}
                            className="user-avatar"
                        />
                        <div className="user-info user-info-container">
                            <h4 className="user-login">{user.login}</h4>
                            <p className="text-muted">Full Name: {user.fullName || 'N/A'}</p>
                            <p className="text-muted">Rating: {user.rating || 0}</p>
                            {decodedUser?.role === 'admin' && (
                                <button onClick={handleDeleteUser} className="btn btn-danger mt-3">
                                    <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>  Delete User
                                </button>
                            )}
                        </div>
                    </div>
                )}
                {posts && (
                    <div className="row">
                        {posts.map((post) => (
                            <PostCard key={post.id} post={post} />
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default UserPage;
