// src/components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';

const Header = ({ hideAuthorizationButtons }) => {
    return (
        <header className="navbar navbar-expand-lg navbar-light bg-light p-3">
            <div className="container-fluid">
                {/* App Name */}
                <a className="navbar-brand fw-bold" href="/">
                    McOk
                </a>

                {/* Search Bar */}
                <form className="d-flex me-auto ms-auto w-75" role="search">
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

                {/* Buttons for Login and Sign Up */}
                {!hideAuthorizationButtons && (
                    < div className="d-flex gap-2">
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
                    </div>
                )}
            </div>
        </header >
    );
};

export default Header;
