import React from 'react';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import PostCard from '../Home/components/PostCard/PostCard';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import $api from '../../api';

const UserPage = () => {
    const { userId } = useParams();

    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        console.log("PENISPENISPENIS")
        const fetchUserPostData = async () => {
            try {
                const userResponse = await $api.get(`/users/${userId}`);
                const postsResponse = await $api.get(`/posts/${userId}/posts`);

                console.log(userResponse.data);
                console.log(postsResponse.data);

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
        <div className="section ">
            <Header />
            {(user && posts) && (
                <>
                    <div className="user-card shadow p-3 mb-5 bg-white rounded">
                        <div className="d-flex align-items-center">
                            <img
                                src={isValidUrl(user.profilePicture)
                                    ? user.profilePicture
                                    : `${process.env.REACT_APP_BACK_URL_IMG}/${user.profilePicture}`}
                                alt={`${user.login}'s Profile`}
                                className="rounded-circle me-3 user-avatar"
                            />
                            <div>
                                <h4 className="user-login">{user.login}</h4>
                                <p className="text-muted">Full Name: {user.fullName || 'N/A'}</p>
                                <p className="text-muted">Role: {user.role}</p>
                                <p className="text-muted">Rating: {user.rating || 0}</p>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        {posts && posts.length > 0 ? (
                            posts.map((post) => <PostCard key={post.id} post={post} />)
                        ) : (
                            <p className="text-muted">This user has not posted anything yet.</p>
                        )}
                    </div>
                </>)}
            <Footer />
        </div>
    );
};

export default UserPage;
