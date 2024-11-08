// src/pages/SignUp.js
import React, { useState } from "react";
import { Link, useAsyncError } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import './SignUp.css';


import Header from "../../components/Header/Header";

const SignUp = () => {
    const [signUpData, setSignUpData] = useState({
        login: "",
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [isPasswordVisible, setPasswordVisible] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const togglePasswordVisibility = () => {
        setPasswordVisible(!isPasswordVisible);
    };

    const handleChange = (e) => {
        setSignUpData({
            ...signUpData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (signUpData.confirmPassword !== signUpData.password) {
            setError("Passwords do not match");
            return;
        }

        const url = `${process.env.REACT_APP_BACK_URL}/api/auth/register`;

        fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                login: signUpData.login,
                password: signUpData.password,
                email: signUpData.email,
                fullName: signUpData.fullName
            })
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(data => {
                        throw new Error(data.message);
                    });
                }
                return response.json();
            })
            .then(data => {
                console.log("Response:", data);
                setSuccess(data.message);
            })
            .catch(error => {
                setError(error.message);
            });
    };

    return (
        <>
            <Header hideAuthorizationButtons={true} />
            <div className="container d-flex justify-content-center align-items-center flex-column mt-5" style={{ minHeight: '80vh' }}>
                <div className="card p-4" style={{ width: "100%", maxWidth: "400px" }}>
                    <h2 className="text-center mb-4">Sign Up</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group mb-3">
                            <label htmlFor="login">Login</label>
                            <input
                                type="text"
                                className="form-control"
                                id="login"
                                name="login"
                                value={signUpData.login}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="fullName">Full Name</label>
                            <input
                                type="text"
                                className="form-control"
                                id="fullName"
                                name="fullName"
                                value={signUpData.fullName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                name="email"
                                value={signUpData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="confirmPassword">Password</label>
                            <div className="password-input-wrapper">
                                <input
                                    type={isPasswordVisible ? "text" : "password"}
                                    className="form-control"
                                    id="password"
                                    name="password"
                                    value={signUpData.password}
                                    onChange={handleChange}
                                    required
                                />
                                <button
                                    type="button"
                                    className="toggle-password-btn"
                                    onClick={togglePasswordVisibility}
                                >
                                    <FontAwesomeIcon icon={isPasswordVisible ? faEyeSlash : faEye} />
                                </button>
                            </div>
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <div className="password-input-wrapper">
                                <input
                                    type={isPasswordVisible ? "text" : "password"}
                                    className="form-control"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={signUpData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                                <button
                                    type="button"
                                    className="toggle-password-btn"
                                    onClick={togglePasswordVisibility}
                                >
                                    <FontAwesomeIcon icon={isPasswordVisible ? faEyeSlash : faEye} />
                                </button>
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary w-100">
                            Sign Up
                        </button>
                        {error && (
                            <div className="alert alert-danger text-center mt-3">
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="alert alert-success text-center mt-3">
                                {success}
                            </div>
                        )}
                    </form>
                </div>
                <div className="text-center mt-3">
                    <p>
                        Already have an account? <Link to="/login">Login</Link>
                    </p>
                </div>
            </div>
        </>
    );
};

export default SignUp;
