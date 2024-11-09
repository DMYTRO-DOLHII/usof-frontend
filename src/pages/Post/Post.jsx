// src/pages/Post/Post.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import Comment from '../../components/Comment/Comment'; // Import the Comment component
import './Post.css';
import $api from '../../api';

const Post = () => {
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await $api.get(`/posts/${postId}`);
                if (response.status === 404) {
                    navigate('/404');
                    return;
                }
                const data = response.data;
                setPost(data);
            } catch (err) {
                if (err.response && err.response.status === 404) {
                    navigate('/404');
                } else {
                    setError(err.message);
                }
            } finally {
                setLoading(false);
            };
        };

        fetchPost();
    }, [postId]);

    if (loading) return <p>Loading post...</p>;
    if (error) return <p className="text-danger">{error}</p>;

    return (
        <div className="d-flex flex-column min-vh-100">
            <Header />
            <div className="container my-5 post-content">
                {post && (
                    <>
                        <h1 className="post-title gradient">{post.title}</h1>
                        <p className="post-meta text-muted">
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

                        {/* Render Comments Section */}
                        <div className="comments-section mt-5">
                            <h3>Comments</h3>
                            {post.comments && post.comments.length > 0 ? (
                                post.comments.map((comment) => (
                                    <Comment
                                        key={comment.id}
                                        content={comment.content}
                                        publishDate={comment.publishDate}
                                        status={comment.status}
                                    />
                                ))
                            ) : (
                                <p>No comments available for this post.</p>
                            )}
                        </div>
                    </>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default Post;
