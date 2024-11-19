import React from 'react';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import PostCard from '../Home/components/PostCard/PostCard';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import $api from '../../api';
import './UserPage.css'

const UserPage = () => {
    const { userId } = useParams();

    const token = localStorage.getItem('token');

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
        }

        fetchUserPostData();
    }, []);

    const isValidUrl = (string) => {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
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
                            <p className="text-muted">Role: {user.role}</p>
                            <p className="text-muted">Rating: {user.rating || 0}</p>
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
