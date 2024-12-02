import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import './Header.css';
import SearchInput from './components/SearchInput';
import { decodeToken } from '../../utils/token';
import $api from '../../api';
import { setSearch } from '../../store/slices/postSlice';

const Header = ({ hideAuthorizationButtons }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (token) fetchMe(decodeToken(token).id);
    }, []);

    const toggleOverlay = () => {
        setIsOpen(!isOpen);
    };

    const fetchMe = async (id) => {
        try {
            const response = await $api.get(`/users/${id}`);
            if (response.status != 200) throw new Error('Error fetching user info');
            const data = response.data;
            setUser(data);
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

                <a className="navbar-brand fw-bold gradient" href='/'>
                    McOk
                </a>

                <SearchInput />

                {!hideAuthorizationButtons && (
                    <div className="d-flex gap-2">
                        {user && user.profilePicture ? (
                            <Link to="/account">
                                <img
                                    src={isValidUrl(user.profilePicture)
                                        ? user.profilePicture
                                        : `${process.env.REACT_APP_BACK_URL_IMG}/${user.profilePicture}`}
                                    alt="Profile"
                                    className="profile-icon"
                                />
                            </Link>
                        ) : (
                            <div className='authorization-block'>
                                <div className="login-button">
                                    <Link to={'/login'}>
                                        <button className="btn btn-outline-primary" type="button">
                                            Login
                                        </button>
                                    </Link>
                                </div>
                                <div className='sign-up-button'>
                                    <Link to={'/sign-up'}>
                                        <button className="btn btn-primary sign-up-button" type="button">
                                            Sign Up
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {
                isOpen && (
                    <div className="overlay" onClick={toggleOverlay}>
                        <div className="overlay-content">
                            <Link to="/login" onClick={toggleOverlay}>Login</Link>
                            <Link to="/" onClick={toggleOverlay}>Home</Link>
                            {localStorage.getItem('token') && (
                                <><Link to="/account" onClick={toggleOverlay}>My Account</Link></>
                            )
                            }
                            <Link to="/users" onClick={toggleOverlay}>Users</Link>
                        </div>
                    </div>
                )
            }
        </header >
    );
};

export default Header;
