import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown, faTrash } from '@fortawesome/free-solid-svg-icons';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import $api from '../../api';
import { decodeToken } from '../../utils/token';
import './Post.css';
import { marked } from 'marked';

marked.setOptions({
    gfm: true,
    breaks: true,
    sanitize: false,
});

const Post = () => {
    const token = localStorage.getItem('token');

    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [commentsLoading, setCommentsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [commentsError, setCommentsError] = useState(null);
    const [sortOrder, setSortOrder] = useState('dateCreated');
    const [userLikeStatus, setUserLikeStatus] = useState(null);
    const [user, setUser] = useState(null);
    const [isLiked, setIsLiked] = useState(false);
    const [isDisliked, setIsDisliked] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        // Decode token if exists and set user info
        const fetchUser = () => {
            try {
                if (token) {
                    const decodedUser = decodeToken(token);
                    setUser(decodedUser);
                }
            } catch (err) {
                console.error('Failed to fetch user:', err);
            }
        };

        // Fetch post data and determine if user has liked/disliked the post
        const fetchPost = async () => {
            try {
                const response = await $api.get(`/posts/${postId}`);
                if (response.status === 404) {
                    navigate('/404');
                    return;
                }
                setPost(response.data);
                determineUserLikeStatus(response.data.likes);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
        fetchPost();
    }, [postId, navigate]);

    const determineUserLikeStatus = (likes) => {
        if (!post.user) return;
        const userLike = likes.find(like => like.userId === post.user.id);
        if (userLike) {
            setUserLikeStatus(userLike.type);
            setIsLiked(userLike.type === 'like');
            setIsDisliked(userLike.type === 'dislike');
        }
    };

    const sortComments = (comments, order) => {
        switch (order) {
            case 'highestScore':
                return [...comments].sort((a, b) => b.likes.filter(l => l.type === 'like').length - a.likes.filter(l => l.type === 'like').length);
            case 'active':
                return [...comments].filter(comment => comment.status === 'active');
            case 'dateCreated':
            default:
                return [...comments].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
    };

    const handleSortChange = (e) => {
        setSortOrder(e.target.value);
    };

    const countLikesDislikes = (likes) => {
        let likeCount = 0, dislikeCount = 0;
        likes.forEach(like => {
            if (like.type === 'like') likeCount++;
            if (like.type === 'dislike') dislikeCount++;
        });
        return { likeCount, dislikeCount };
    };

    const isValidUrl = (string) => {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    };

    const handleLikeDislike = async (type) => {
        if (!user) return;

        try {
            const response = await $api.post(`/posts/${postId}/like`, { type });
            setUserLikeStatus(type);
            setIsLiked(type === 'like');
            setIsDisliked(type === 'dislike');
        } catch (err) {
            console.error('Failed to like/dislike post:', err);
        }
    };

    const handleDeletePost = async () => {
        try {
            await $api.delete(`/posts/${postId}`);
            navigate('/');
        } catch (err) {
            console.error('Failed to delete post:', err);
        }
    };

    if (loading) return <p>Loading post...</p>;
    if (error) return <p className="text-danger">{error}</p>;

    const isCreatorOrAdmin = user && (user.id === post?.userId || user.role === 'admin');
    const postLikes = post ? countLikesDislikes(post.likes) : { likeCount: 0, dislikeCount: 0 };

    return (
        <div className="d-flex flex-column min-vh-100">
            <Header />
            <div className="post-content">
                {post && (
                    <div className="post-card-single">
                        <h1 className="post-title gradient">{post.title}</h1>
                        <p className="post-meta">
                            Published on: {new Date(post.publishDate).toLocaleDateString()}
                        </p>
                        <p>
                            Status:
                            <span className={`status ${post.status === 'active' ? 'status-active-text' : 'status-inactive-text'}`}>
                                {post.status}
                            </span>
                        </p>
                        <div className="post-body" dangerouslySetInnerHTML={{ __html: marked(post.content) }}>

                        </div>

                        <div className="post-likes">
                            <span
                                onClick={() => handleLikeDislike('like')}
                            >
                                <FontAwesomeIcon
                                    icon={faChevronUp}
                                    className={`like-icon ${userLikeStatus === 'like' ? 'active-like' : ''}`}
                                /> {postLikes.likeCount}
                            </span>
                            <span
                                onClick={() => handleLikeDislike('dislike')}
                            >
                                <FontAwesomeIcon
                                    icon={faChevronDown}
                                    className={`dislike-icon ${userLikeStatus === 'dislike' ? 'active-dislike' : ''}`}
                                /> {postLikes.dislikeCount}
                            </span>
                        </div>

                        <div className="post-user-info">
                            <img
                                src={isValidUrl(post.user.profilePicture)
                                    ? post.user.profilePicture
                                    : `${process.env.REACT_APP_BACK_URL_IMG}/${post.user.profilePicture}`}
                                className="user-avatar" />
                            <Link to={`/users/${post.user.id}`}>{post.user.login}</Link>
                        </div>

                        {isCreatorOrAdmin && (
                            <button onClick={handleDeletePost} className="btn btn-danger">
                                <FontAwesomeIcon icon={faTrash} /> Delete Post
                            </button>
                        )}
                    </div>
                )}

                <div className="comments-section">
                    <h3>Comments</h3>
                    <div className="sort-container">
                        <label htmlFor="sort-comments">Sort by:</label>
                        <select id="sort-comments" value={sortOrder} onChange={handleSortChange} className="sort-dropdown">
                            <option value="highestScore">Highest Score</option>
                            <option value="active">Active</option>
                            <option value="dateCreated">Date Created</option>
                        </select>
                    </div>

                    {commentsLoading ? (
                        <p>Loading comments...</p>
                    ) : commentsError ? (
                        <p className="text-danger">{commentsError}</p>
                    ) : comments.length > 0 ? (
                        comments.map((comment) => {
                            const { likeCount, dislikeCount } = countLikesDislikes(comment.likes);
                            return (
                                <div key={comment.id} className="comment-card">
                                    <div className="comment-content">
                                        <div className="comment-title">{comment.content}</div>
                                        <div className="comment-meta">
                                            Published on: {new Date(comment.publishDate).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div className="comment-likes">
                                        <span>
                                            <FontAwesomeIcon icon={faChevronUp} className="like-icon" /> {likeCount}
                                        </span>
                                        <span>
                                            <FontAwesomeIcon icon={faChevronDown} className="dislike-icon" /> {dislikeCount}
                                        </span>
                                    </div>
                                    <div className={`status-indicator ${comment.status === 'active' ? 'active' : 'inactive'}`}></div>
                                </div>
                            );
                        })
                    ) : (
                        <p>No comments available for this post.</p>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Post;
