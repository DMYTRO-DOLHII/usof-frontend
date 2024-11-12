import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import PostCard from './components/PostCard/PostCard';
import Pagination from '../../components/Pagination/Pagination';
import { getAllPosts } from '../../store/slices/postSlice';
import './Home.css';

const Home = () => {
    const dispatch = useDispatch();
    const { posts, search, totalPages } = useSelector(state => state.post);
    const test = useSelector((state) => state.post);

    const postLimit = 30;
    const [page, setPage] = useState(1);

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

    return (
        <div className="d-flex flex-column min-vh-100">
            <Header />
            <div className="container my-5">
                <h1>Welcome to McOk</h1>
                <div className="row">
                    {posts.map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))}
                </div>

                {/* Pagination */}
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
