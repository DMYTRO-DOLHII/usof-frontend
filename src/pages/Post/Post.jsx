import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import $api from '../../api';
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

    const navigate = useNavigate();

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
        fetchComments();
    }, [sortOrder]);

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

    if (loading) return <p>Loading post...</p>;
    if (error) return <p className="text-danger">{error}</p>;

    return (
        <div className="d-flex flex-column min-vh-100">
            <Header />
            <div className="post-content">
                {post && (
                    <div className="post-card-single">
                        <h1 className="post-title gradient">{post.title}</h1>
                        <p className="post-meta">
                            Published on: {new Date(post.publishDate).toLocaleDateString()} | Status:
                            <span className={`status ${post.status === 'active' ? 'status-active-text' : 'status-inactive-text'}`}>
                                {post.status}
                            </span>
                        </p>
                        <div className="post-body">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {post.content}
                            </ReactMarkdown>
                        </div>
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
