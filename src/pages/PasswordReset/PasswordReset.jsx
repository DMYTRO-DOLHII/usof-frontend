import React, { useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './PasswordReset.css';
import $api from '../../api';

const PasswordReset = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');

    const { token } = useParams();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        // Frontend validation for matching passwords
        if (password !== confirmPassword) {
            setMessage('Passwords do not match.');
            return;
        }

        try {
            const response = await $api.post(`/auth/password-reset/${token}`, {
                newPassword: password,
            });

            if (response.status === 200) {
                setMessage('Password reset successful! You can now log in with your new password.');
            } else {
                setMessage('Password reset failed. Please try again or contact support.');
            }
        } catch (error) {
            console.error('Error resetting password:', error);
            setMessage('An error occurred. Please try again later.');
        }
    };

    return (
        <div className="page-container">
            <Header />
            <div className="password-reset-content">
                <h1>Password Reset</h1>
                {token ? (
                    <div className='card p-4' style={{ width: "100%", maxWidth: "400px" }}>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="password">New Password:</label>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    className="form-control"
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="confirmPassword">Confirm New Password:</label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    className="form-control"
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-primary">Reset Password</button>
                        </form>
                    </div>
                ) : (
                    <p>Invalid or missing token.</p>
                )}
                {message && <p className="message">{message}</p>}
            </div>
            <Footer />
        </div>
    );
};

export default PasswordReset;