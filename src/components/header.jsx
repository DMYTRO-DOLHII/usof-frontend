import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import './Header.css';

const Header = ({ hideAuthorizationButtons }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    const toggleOverlay = () => {
        setIsOpen(!isOpen);
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
                        {isLoggedIn ? (
                            <Link to="/account">
                                <div className="profile-icon"></div>
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
