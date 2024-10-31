// src/pages/Post/Post.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import './Post.css';

const Post = () => {
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BACK_URL}/api/posts/${postId}`);
                if (response.status === 404) {
                    navigate('/404');
                    return;
                }
                if (!response.ok) throw new Error('Error fetching post data');
                const data = await response.json();
                setPost(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
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
                            <span className={`status ${post.status === 'active' ? 'status-active' : 'status-inactive'}`}>
                                {post.status}
                            </span>
                        </p>
                        <div className="post-body">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {post.content}
                            </ReactMarkdown>
                        </div>
                    </>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default Post;
