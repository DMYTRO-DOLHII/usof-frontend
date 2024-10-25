// src/pages/Login.js
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Header";

const Login = () => {
    const [loginData, setLoginData] = useState({
        login: "",
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setLoginData({
            ...loginData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Login submitted:", loginData);

        const url = `${process.env.REACT_APP_BACK_URL}/api/auth/login`;

        fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                login: loginData.login,
                email: loginData.email,
                password: loginData.password,
            })
        })
            .then(response => response.json())
            .then(data => console.log("Response:", data))
            .catch(error => console.error("Error:", error));
    };

    return (
        <>
            <Header hideAuthorizationButtons={true} />
            <div className="container d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
                <div className="card p-4" style={{ width: "100%", maxWidth: "400px" }}>
                    <h2 className="text-center mb-4">Login</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group mb-3">
                            <label htmlFor="login">Login</label>
                            <input
                                type="login"
                                className="form-control"
                                id="login"
                                name="login"
                                value={loginData.login}
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
                                value={loginData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                name="password"
                                value={loginData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary w-100">
                            Login
                        </button>
                    </form>
                    <div className="text-center mt-3">
                        <p>
                            Don't have an account? <Link to="/sign-up">Sign up</Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;
