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
import $api from '../../api';

const Home = () => {
    const dispatch = useDispatch();
    const { posts, search, totalPages } = useSelector(state => state.post);

    const navigate = useNavigate();

    const postLimit = 30;
    const [page, setPage] = useState(1);
    const [sortOrder, setSortOrder] = useState('dateCreated');
    const [userLogin, setUserLogin] = useState(null);
    const token = localStorage.getItem('token');

    const fetchMe = async (id) => {
        try {
            const response = await $api.get(`/users/${id}`);
            if (response.status !== 200) throw new Error('Error fetching user info');
            const data = response.data;
            setUserLogin(data.login);
        } catch (err) {

        } finally {

        }
    };

    useEffect(() => {
        if (token) fetchMe(decodeToken(token).id);

        dispatch(getAllPosts({
            offset: (page - 1) * postLimit,
            limit: postLimit,
            search: search,
            sort: sortOrder,
        }));
    }, [page, search, sortOrder, token, dispatch]);

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const handleSortChange = (event) => {
        setSortOrder(event.target.value);
    };

    const handleCreatePost = () => {
        navigate('/create-post');
    };

    return (
        <div className="d-flex flex-column min-vh-100">
            <Header />
            <div className="container my-5">
                <h1>
                    Welcome to McOk {userLogin && (
                        <>
                            ,
                            <span className='gradient'> {userLogin}</span>
                        </>
                    )}
                </h1>

                {token && (
                    <button onClick={handleCreatePost} className="btn btn-primary mb-4">
                        Create a Post
                    </button>
                )}

                <div className="sort-container mb-4">
                    <label htmlFor="sort-posts">Sort by:</label>
                    <select
                        id="sort-posts"
                        value={sortOrder}
                        onChange={handleSortChange}
                        className="sort-dropdown"
                    >
                        <option value="highestScore">Highest Score</option>
                        <option value="active">Active</option>
                        <option value="dateCreated">Date Created</option>
                    </select>
                </div>

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
