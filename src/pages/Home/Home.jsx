import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import PostCard from './components/PostCard';
import './Home.css';
import { decodeTokenLogin } from '../../utils/token';

import { getAllPosts } from '../../store/slices/postSlice';
import { useDispatch, useSelector } from 'react-redux';

const Home = () => {
    const dispatch = useDispatch();
    // const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [inputPage, setInputPage] = useState(1);

    const { posts, search, totalPages } = useSelector(state => state.post);

    const postLimit = 30;

    useEffect(() => {
        dispatch(getAllPosts({offset: ((page - 1) * postLimit), limit: postLimit, search: search}));
    }, []);

    const handleNextPage = () => {
        if (page < totalPages) {
            setPage(page + 1);
            dispatch(getAllPosts({offset: ((page - 1) * postLimit), limit: postLimit, search: search}));
        }
    };

    const handlePreviousPage = () => {
        if (page > 1) {
            setPage(page - 1);
            dispatch(getAllPosts({offset: ((page - 1) * postLimit), limit: postLimit, search: search}));
        }
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
                            <PostCard post={post}></PostCard>
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
