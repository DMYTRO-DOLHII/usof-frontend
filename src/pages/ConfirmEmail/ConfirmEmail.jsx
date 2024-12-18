import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './ConfirmEmail.css';
import $api from '../../api';

const ConfirmEmail = () => {
    const [message, setMessage] = useState('Verifying email...');
    const location = useLocation();

    useEffect(() => {
        // Extract the token from the query parameters
        const queryParams = new URLSearchParams(location.search);
        const token = queryParams.get('token');

        // Send token to backend for verification
        if (token) {
            confirmEmail(token);
        } else {
            setMessage('Invalid confirmation link.');
        }
    }, [location.search]);

    const confirmEmail = async (token) => {
        try {
            const response = await $api.post('/auth/confirm-email', { token })


            if (response.status === 200) {
                setMessage('Your email confirmation was successful!');
            } else {
                setMessage('Email confirmation failed. Please try again or contact support.');
            }
        } catch (error) {
            console.error('Error confirming email:', error);
            setMessage('An error occurred. Please try again later.');
        }
    };

    return (
        <div className="page-container">
            <Header />
            <div className="confirm-email-content">
                <h1>Email Confirmation</h1>
                <p>{message}</p>
            </div>
            <Footer />
        </div>
    );
};

export default ConfirmEmail;
