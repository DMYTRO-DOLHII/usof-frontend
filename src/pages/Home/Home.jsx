import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import PostCard from './components/PostCard/PostCard';
import Pagination from '../../components/Pagination/Pagination';
import { getAllPosts } from '../../store/slices/postSlice';
import './Home.css';
import { useNavigate } from 'react-router-dom';
import { decodeToken } from '../../utils/token';

const Home = () => {
    const dispatch = useDispatch();
    const { posts, search, totalPages } = useSelector(state => state.post);

    const navigate = useNavigate();

    const postLimit = 30;
    const [page, setPage] = useState(1);

    // Check for token in localStorage
    const token = localStorage.getItem('token');

    useEffect(() => {
        dispatch(getAllPosts({
            offset: (page - 1) * postLimit,
            limit: postLimit,
            search: search,
        }));
    }, [page, search, dispatch]);

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const handleCreatePost = () => {
        navigate('/create-post');
    }

    return (
        <div className="d-flex flex-column min-vh-100">
            <Header />
            <div className="container my-5">
                <h1>
                    Welcome to McOk {token && (
                        <>
                        ,
                            <span className='gradient'> {decodeToken(token).login}</span>
                        </>
                    )}
                </h1>

                {token && (
                    <button onClick={handleCreatePost} className="btn btn-primary mb-4">
                        Create a Post
                    </button>
                )}

                <div className="row">
                    {posts.map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))}
                </div>

                <Pagination
                    totalPages={totalPages}
                    currentPage={page}
                    onPageChange={handlePageChange}
                />
            </div>
            <Footer />
        </div>
    );
};

export default Home;
