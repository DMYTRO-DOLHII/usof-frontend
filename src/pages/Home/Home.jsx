import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import './Home.css';
import '../../App.css';
import { decodeToken } from '../../utils/token';

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
            setInputPage(page); // Update inputPage to reflect the current page
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
            const newPage = Math.min(Math.max(1, parseInt(inputPage) || 1), totalPages); // Ensure within valid range
            setPage(newPage); // Update the page to the user-specified page number
        }
    };

    return (
        <div className="d-flex flex-column min-vh-100">
            <Header />
            <div className="container my-5">
                <h1>
                    Welcome to <span className='gradient'>McOk</span>
                    {/* {user && (
                        <span>, {user.fullName}</span> // Display user full name
                    )} */}
                </h1>
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
                <div className="d-flex justify-content-between mt-4 align-items-center">
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
                            onKeyDown={handlePageInputSubmit} // Enter key triggers the change
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
