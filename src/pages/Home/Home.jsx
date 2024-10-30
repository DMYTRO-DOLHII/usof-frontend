import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import './Home.css';
import '../../App.css';

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const postLimit = 12;
    const navigate = useNavigate();

    useEffect(() => {
        fetchPosts(page);
    }, [page]);

    const handleCardClick = (postId) => {
        navigate(`/posts/${postId}`);
    };

    const fetchPosts = async (page) => {
        setLoading(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_BACK_URL}/api/posts?page=${page}&limit=${postLimit}`);
            if (!response.ok) throw new Error('Error fetching posts');
            const data = await response.json();
            console.log(data);
            setPosts(data.posts);
            setTotalPages(data.pagination.totalPages);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleNextPage = () => {
        if (page < totalPages) setPage(page + 1);
    };

    const handlePreviousPage = () => {
        if (page > 1) setPage(page - 1);
    };

    return (
        <div className="d-flex flex-column min-vh-100">
            <Header />
            <div className="container my-5">
                <h1>Welcome to <span className='gradient'>McOk</span></h1>
                {error && <p className="text-danger">{error}</p>}
                {loading ? (
                    <p>Loading posts...</p>
                ) : (
                    <div className="row">
                        {posts.map((post) => (
                            <div key={post.id} className="col-md-4 mb-4" onClick={() => handleCardClick(post.id)}>
                                <div className="card">
                                    <div className="card-body">
                                        <h5 className="card-title">{post.title}</h5>
                                        <p className="card-text">
                                            <span className={`${post.status === 'active' ? 'badge-success' : 'badge-secondary'}`}>
                                                {post.status}
                                            </span>
                                        </p>
                                        <small className="text-muted">
                                            Published on: {new Date(post.publishDate).toLocaleDateString()}
                                        </small>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {/* Pagination Controls */}
                <div className="d-flex justify-content-between mt-4">
                    <button
                        className="btn btn-secondary"
                        onClick={handlePreviousPage}
                        disabled={page === 1}
                    >
                        Previous
                    </button>
                    <span>Page {page} of {totalPages}</span>
                    <button
                        className="btn btn-secondary"
                        onClick={handleNextPage}
                        disabled={page === totalPages}
                    >
                        Next
                    </button>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Home;
