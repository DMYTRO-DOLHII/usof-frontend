import React, { useEffect, useState } from 'react';
import './Users.css';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import UserCard from './components/UserCard/UserCard';
import Pagination from '../../components/Pagination/Pagination';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers } from '../../store/slices/userSlice';

const Users = () => {
    const dispatch = useDispatch();
    const { users, search, totalPages } = useSelector(state => state.user);

    const [page, setPage] = useState(1);
    const userLimit = 30;

    useEffect(() => {
        dispatch(getAllUsers({
            offset: (page - 1) * userLimit,
            limit: userLimit,
            search: search,
        }));
    }, [page, search, dispatch]);

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    return (
        <div className="page-container">
            <Header />
            <div className="content my-5">
                <h1><span className='gradient'>Users</span></h1>
                <div className="users-container">
                    {users.map((user) => (
                        <UserCard key={user.id} user={user} />
                    ))}
                </div>

                {/* Pagination Controls */}
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

export default Users;