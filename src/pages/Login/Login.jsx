// src/pages/Login.js
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Header";

const Login = () => {
    const [loginData, setLoginData] = useState({
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
        // Perform login action (e.g., API call)
    };

    return (
        <>
            <Header hideAuthorizationButtons={true} />
            <div className="container d-flex justify-content-center align-items-center" style={{height: '80vh'}}>
                <div className="card p-4" style={{ width: "100%", maxWidth: "400px" }}>
                    <h2 className="text-center mb-4">Login</h2>
                    <form onSubmit={handleSubmit}>
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
