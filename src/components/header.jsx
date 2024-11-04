import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import './Header.css';
import { decodeToken } from '../utils/token';

const Header = ({ hideAuthorizationButtons }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (token) fetchMe(decodeToken(token));
    }, []);

    const toggleOverlay = () => {
        setIsOpen(!isOpen);
    };

    const fetchMe = async (token) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACK_URL}/api/users/${token}`);
            if (!response.ok) throw new Error('Error fetching user info');
            const data = await response.json();
            setUser(data); // Set the user information in state
        } catch (err) {
            setError(err.message);
        } finally {

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
        <header className="navbar navbar-expand-lg navbar-light bg-light p-3">
            <div className="container-fluid">
                <div className="burger-icon" onClick={toggleOverlay}>
                    &#9776;
                </div>

                <a className="navbar-brand fw-bold gradient" href="/">
                    McOk
                </a>

                <form className="d-flex me-auto ms-auto w-50" role="search">
                    <input
                        className="form-control me-2 w-100"
                        type="search"
                        placeholder="Search..."
                        aria-label="Search"
                    />
                    <button className="btn btn-outline-success" type="submit">
                        Search
                    </button>
                </form>

                {!hideAuthorizationButtons && (
                    <div className="d-flex gap-2">
                        {user && user.profilePicture ? (
                            <Link to="/account">
                                <img
                                    src={isValidUrl(user.profilePicture)
                                        ? user.profilePicture
                                        : `${process.env.REACT_APP_BACK_URL}/${user.profilePicture}`}
                                    alt="Profile"
                                    className="profile-icon"
                                />
                            </Link>
                        ) : (
                            <>
                                <Link to={'/login'}>
                                    <button className="btn btn-outline-primary" type="button">
                                        Login
                                    </button>
                                </Link>
                                <Link to={'/sign-up'}>
                                    <button className="btn btn-primary" type="button">
                                        Sign Up
                                    </button>
                                </Link>
                            </>
                        )}
                    </div>
                )}
            </div>

            {isOpen && (
                <div className="overlay" onClick={toggleOverlay}>
                    <div className="overlay-content">
                        <Link to="/account" onClick={toggleOverlay}>My Account</Link>
                        <Link to="/" onClick={toggleOverlay}>Home</Link>
                        <Link to="/users" onClick={toggleOverlay}>Users</Link>
                        <Link to="/favorites" onClick={toggleOverlay}>Favorites</Link>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
