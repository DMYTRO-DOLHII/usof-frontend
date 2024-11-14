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

const Post = () => {
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

    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                if (localStorage.getItem('token')) {
                    const user = decodeToken(localStorage.getItem('token'));
                    setUser(user);
                }
            } catch (err) {
                console.error('Failed to fetch user:', err);
            }
        };

        fetchUser();
    }, []);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await $api.get(`/posts/${postId}`);
                if (response.status === 404) {
                    navigate('/404');
                    return;
                }
                setPost(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [postId, navigate]);

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

    useEffect(() => {
        const fetchComments = async () => {
            setCommentsLoading(true);
            try {
                const response = await $api.get(`/posts/${postId}/comments`);
                console.log(response.data);
                const sortedComments = sortComments(response.data, sortOrder);
                setComments(sortedComments);
            } catch (err) {
                setCommentsError(err.message);
            } finally {
                setCommentsLoading(false);
            }
        };

        fetchComments();
    }, [sortOrder]);

    const handleSortChange = (e) => {
        setSortOrder(e.target.value);
    };

    const determineUserLikeStatus = (likes) => {
        if (!user) return;
        const userLike = likes.find(like => like.userId === user.id);
        setUserLikeStatus(userLike ? userLike.type : null);
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

            if (type === 'like') {
                if (userLikeStatus === 'dislike') {
                    setPost(prev => ({ ...prev, likes: { ...prev.likes, likeCount: prev.likes.likeCount + 1, dislikeCount: prev.likes.dislikeCount - 1 } }));
                } else if (userLikeStatus === null) {
                    setPost(prev => ({ ...prev, likes: { ...prev.likes, likeCount: prev.likes.likeCount + 1 } }));
                }
            } else if (type === 'dislike') {
                if (userLikeStatus === 'like') {
                    setPost(prev => ({ ...prev, likes: { ...prev.likes, likeCount: prev.likes.likeCount - 1, dislikeCount: prev.likes.dislikeCount + 1 } }));
                } else if (userLikeStatus === null) {
                    setPost(prev => ({ ...prev, likes: { ...prev.likes, dislikeCount: prev.likes.dislikeCount + 1 } }));
                }
            }
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

    const isLiked = userLikeStatus === 'like';
    const isDisliked = userLikeStatus === 'dislike';

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
                        <div className="post-body">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {post.content}
                            </ReactMarkdown>
                        </div>

                        <div className="post-likes">
                            <span
                                onClick={() => handleLikeDislike('like')}
                                className={`like-icon ${userLikeStatus === 'like' ? 'active-like' : ''}`}
                            >
                                <FontAwesomeIcon icon={faChevronUp} /> {postLikes.likeCount}
                            </span>
                            <span
                                onClick={() => handleLikeDislike('dislike')}
                                className={`dislike-icon ${userLikeStatus === 'dislike' ? 'active-dislike' : ''}`}
                            >
                                <FontAwesomeIcon icon={faChevronDown} /> {postLikes.dislikeCount}
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
