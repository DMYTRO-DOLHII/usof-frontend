import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown, faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import Comment from './components/Comment/Comment';
import $api from '../../api';
import { decodeToken } from '../../utils/token';
import './Post.css';
import { marked } from 'marked';
import hljs from 'highlight.js';

marked.setOptions({
    gfm: true,
    breaks: true,
    smartLists: true,
    smartypants: true,
    highlight: (code, lang) => {
        if (hljs.getLanguage(lang)) {
            return hljs.highlight(lang, code).value;
        } else {
            return hljs.highlightAuto(code).value;
        }
    },
});

const Post = () => {
    const token = localStorage.getItem('token');
    const previewRef = useRef();
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

    const [isPostCreator, setIsPostCreator] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        try {
            if (token) {
                const decodedUser = decodeToken(token);
                setUser(decodedUser);
            }
        } catch (err) {
            console.error('Failed to fetch user:', err);
        }

        // Fetch post data and determine if user has liked/disliked the post
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

        const fetchComments = async () => {
            setCommentsLoading(true);
            try {
                const response = await $api.get(`/posts/${postId}/comments`);
                const sortedComments = sortComments(response.data, sortOrder);
                setComments(sortedComments);
            } catch (err) {
                setCommentsError(err.message);
            } finally {
                setCommentsLoading(false);
            }
        };

        fetchPost();
        fetchComments();
    }, [postId, navigate]);

    useEffect(() => {
        if (!post || !user) return;
        const userLike = post.likes.find(like => like.userId === user.id);
        if (userLike) {
            setUserLikeStatus(userLike.type);
        }

        setIsPostCreator(user && user.id === post.userId);
        setIsAdmin(user && user.role === 'admin');
    });

    useEffect(() => {
        if (previewRef.current) {
            hljs.highlightAll();
        }
    }, [post]);

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

            if (type === userLikeStatus) {
                setPost((prevPost) => ({
                    ...prevPost,
                    likes: prevPost.likes.filter((like) => like.userId !== user.id),
                }));
                setUserLikeStatus('');
            } else {
                if (type === 'like') {
                    if (userLikeStatus === 'dislike') {
                        setPost((prevPost) => ({
                            ...prevPost,
                            likes: [
                                ...prevPost.likes.filter((like) => like.userId !== user.id),
                                { userId: user.id, type: 'like' },
                            ],
                        }));
                    } else {
                        setPost((prevPost) => ({
                            ...prevPost,
                            likes: [...prevPost.likes, { userId: user.id, type: 'like' }],
                        }));
                    }
                } else if (type === 'dislike') {
                    if (userLikeStatus === 'like') {
                        setPost((prevPost) => ({
                            ...prevPost,
                            likes: [
                                ...prevPost.likes.filter((like) => like.userId !== user.id),
                                { userId: user.id, type: 'dislike' },
                            ],
                        }));
                    } else {
                        setPost((prevPost) => ({
                            ...prevPost,
                            likes: [...prevPost.likes, { userId: user.id, type: 'dislike' }],
                        }));
                    }
                }

                setUserLikeStatus(type); // Update the user's like/dislike status
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

    const handleDeleteComment = async (commentId) => {

        try {
            await $api.delete(`/comments/${commentId}`);
            setComments((prevComments) => prevComments.filter((c) => c.id !== commentId));
        } catch (err) {
            console.error('Failed to delete comment:', err);
            alert('Failed to delete the comment. Please try again.');
        }
    };

    if (loading) return <p>Loading post...</p>;
    if (error) return <p className="text-danger">{error}</p>;

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
                            Status :
                            <span className={`status ${post.status === 'active' ? 'status-active-text' : 'status-inactive-text'}`}>
                                {post.status}
                            </span>
                        </p>
                        <div className="post-body" ref={previewRef} dangerouslySetInnerHTML={{ __html: marked(post.content) }}>

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

                        {(isPostCreator || isAdmin) && (
                            <>
                                <button onClick={handleDeletePost} className="btn btn-danger">
                                    <FontAwesomeIcon icon={faTrash} /> Delete Post
                                </button>
                                <button className="btn btn-primary button-edit">
                                    <FontAwesomeIcon icon={faEdit} /> Edit
                                </button>
                            </>
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
                                        {(user && (comment.userId === user.id || isAdmin)) && (
                                            <button className="btn btn-danger delete-comment">
                                                <FontAwesomeIcon
                                                    icon={faTrash}
                                                    className='delete-comment-icon'
                                                    onClick={() => handleDeleteComment(comment.id)}
                                                />
                                            </button>
                                        )}
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
