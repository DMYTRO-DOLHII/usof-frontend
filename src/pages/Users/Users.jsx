import React, { useEffect, useState } from 'react';
import './Users.css';
import Header from '../../components/header/Header';
import Footer from '../../components/Footer';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [inputPage, setInputPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const userLimit = 30;

    useEffect(() => {
        fetchUsers(page);
    }, [page]);

    const fetchUsers = async (page) => {
        try {
            const response = await fetch(
                `${process.env.REACT_APP_BACK_URL}/api/users?page=${page}&limit=${userLimit}`
            );
            const data = await response.json();
            setUsers(data.users);
            setTotalPages(data.pagination.totalPages);
            setInputPage(page);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const handlePreviousPage = () => {
        if (page > 1) setPage(page - 1);
    };

    const handleNextPage = () => {
        if (page < totalPages) setPage(page + 1);
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

    const isValidUrl = (string) => {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    };

    return (
        <div className="page-container">
            <Header />
            <div className="content my-5">
                <h1><span className='gradient'>Users</span></h1>
                <div className="users-container">
                    {users.map((user) => (
                        <div key={user.id} className="user-card">
                            <img
                                src={isValidUrl(user.profilePicture)
                                    ? user.profilePicture
                                    : `${process.env.REACT_APP_BACK_URL}/${user.profilePicture}`}
                                alt={`${user.fullName}'s avatar`}
                                className="user-avatar" />
                            <h5>{user.fullName}</h5>
                            <p>Rating: {user.rating}</p>
                        </div>
                    ))}
                </div>

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

export default Users;
