import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import './Home.css';
import '../../App.css';
import { decodeTokenLogin } from '../../utils/token';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment } from '@fortawesome/free-solid-svg-icons';

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [inputPage, setInputPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const postLimit = 30;
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
            setPosts(data.posts);
            setTotalPages(data.pagination.totalPages);
            setInputPage(page);
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

    const handlePageInputChange = (e) => {
        setInputPage(e.target.value);
    };

    const handlePageInputSubmit = (e) => {
        if (e.key === 'Enter') {
            const newPage = Math.min(Math.max(1, parseInt(inputPage) || 1), totalPages);
            setPage(newPage);
        }
    };

    return (
        <div className="d-flex flex-column min-vh-100">
            <Header />
            <div className="container my-5">
                <h1>
                    Welcome to <span className='gradient'>McOk</span>
                    {localStorage.getItem('token') && (
                        <span>, {decodeTokenLogin(localStorage.getItem('token'))}</span>
                    )}
                </h1>
                {error && <p className="text-danger">{error}</p>}
                {loading ? (
                    <p>Loading posts...</p>
                ) : (
                    <div className="row">
                        {posts.map((post) => (
                            <div key={post.id} className="col-md-4 mb-4" onClick={() => handleCardClick(post.id)}>
                                <div className={`card post-card ${post.status === 'active' ? 'hover-active' : 'hover-inactive'}`}>
                                    <div className={`status-circle ${post.status === 'active' ? 'status-active' : 'status-inactive'}`}></div>
                                    <div className="card-body">
                                        <h5 className="card-title">{post.title}</h5>
                                        <small className="text-muted">
                                            Published on: {new Date(post.publishDate).toLocaleDateString()}
                                        </small>
                                        <div className="mt-2">
                                            {post.categories && post.categories.length > 0 ? (
                                                <ul className="category-list list-unstyled">
                                                    {post.categories.map((category) => (
                                                        <li key={category.id} className="category-item">
                                                            {category.title}
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <span>No categories available</span>
                                            )}
                                        </div>
                                    </div>
                                    {/* Comment Icon and Count */}
                                    <div className="comments-info">
                                        <FontAwesomeIcon icon={faComment} />{post.commentsCount}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination Controls */}
                <div className="pagination-controls d-flex justify-content-between mt-4 align-items-center">
                    <button
                        className="btn btn-secondary"
                        onClick={handlePreviousPage}
                        disabled={page === 1}
                    >
                        Previous
                    </button>
                    <div className="d-flex align-items-center">
                        <span>Page </span>
                        <input
                            type="number"
                            className="form-control mx-2"
                            style={{ width: '60px', textAlign: 'center' }}
                            value={inputPage}
                            onChange={handlePageInputChange}
                            onKeyDown={handlePageInputSubmit}
                            min={1}
                            max={totalPages}
                        />
                        <span> of {totalPages}</span>
                    </div>
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
