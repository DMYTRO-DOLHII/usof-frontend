import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';
import '../../App.css';

const NotFound = () => {
    return (
        <div className="not-found-container">
            <h1 className='gradient'>404</h1>
            <p>Oops! The page you are looking for does not exist.</p>
            <Link to="/" className="gradient-button">Go back to Home</Link>
        </div>
    );
};

export default NotFound;
