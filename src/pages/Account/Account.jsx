import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Account.css';
import { decodeToken } from '../../utils/token';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const Account = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const fileInputRef = useRef(null); // Reference for the hidden file input

    useEffect(() => {
        if (token) fetchMe(decodeToken(token));
    }, []);

    const fetchMe = async (token) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACK_URL}/api/users/${token}`);
            if (!response.ok) throw new Error('Error fetching user info');
            const data = await response.json();
            setUser(data);
            document.cookie = `fullName=${encodeURIComponent(data.fullName)}; path=/; max-age=86400`;
        } catch (err) {
            setError(err.message);
        }
    };

    const handleLogout = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACK_URL}/api/auth/logout`, {
                method: 'POST',
            });
            if (response.ok) {
                localStorage.removeItem('token');
                navigate('/');
            } else {
                setError('Failed to log out');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const handleImageChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(`${process.env.REACT_APP_BACK_URL}/api/users/avatar`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `${token}`,
                },
                body: formData,
            });
            if (response.ok) {
                const data = await response.json();
                setUser(data.user);
            } else {
                setError('Failed to update profile picture');
            }
        } catch (err) {
            setError(err.message);
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

    const handleImageClick = () => {
        fileInputRef.current.click(); // Trigger file input dialog
    };

    if (error) {
        return <p>Error: {error}</p>;
    }

    if (!user) {
        return <p>Loading...</p>;
    }

    return (
        <>
            <Header />
            <div className="account-page container">
                <h1>Account Information</h1>
                <div className="profile-container">
                    <div className="profile-picture" onClick={handleImageClick} style={{ cursor: 'pointer' }}>
                        <img
                            src={isValidUrl(user.profilePicture)
                                ? user.profilePicture
                                : `${process.env.REACT_APP_BACK_URL}/${user.profilePicture}`}
                            alt="Profile"
                        />
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef} // Attach ref to the file input
                            style={{ display: 'none' }} // Hide the file input
                            onChange={handleImageChange} // Handle file change
                        />
                    </div>
                    <div className="profile-details">
                        <p><strong>Full Name:</strong> {user.fullName}</p>
                        <p><strong>Login:</strong> {user.login}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Rating:</strong> {user.rating}</p>
                    </div>
                    <button onClick={handleLogout} className="btn btn-danger">Log Out</button>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Account;
