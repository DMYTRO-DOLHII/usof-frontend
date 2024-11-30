import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import $api from "../../api";
import axios from "axios";

const Login = () => {
    const [loginData, setLoginData] = useState({
        login: "",
        password: "",
    });
    const navigate = useNavigate();
    const [error, setError] = useState(""); // State to store error message

    const handleChange = (e) => {
        setLoginData({
            ...loginData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await axios.post(`${process.env.REACT_APP_BACK_URL_API}/auth/login`, { login: loginData.login, password: loginData.password });

            if (response.status === 200) {
                const token = response.data.token;
                localStorage.setItem('token', token);
                navigate('/');
            } else {
                throw new Error(response.data.message);
            }
        } catch (error) {
            setError(error.response.data.message);
        }
    };


    return (
        <>
            <Header hideAuthorizationButtons={true} />
            <div className="container d-flex justify-content-center align-items-center flex-column mt-5" style={{ minHeight: '80vh' }}>
                <div className="card p-4" style={{ width: "100%", maxWidth: "400px" }}>
                    <h2 className="text-center mb-4">Login</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group mb-3">
                            <label htmlFor="login">Login or Email</label>
                            <input
                                type="text"
                                className="form-control"
                                id="login"
                                name="login"
                                value={loginData.login}
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
                        {error && (
                            <div className="alert alert-danger text-center mt-3">
                                {error}
                            </div>
                        )}
                    </form>
                </div>
                <div className="text-center mt-3">
                    <p>
                        Forgot your password? <Link to="/request-password-reset">Reset Password</Link>
                    </p>
                </div>

                <div className="text-center mt-3">
                    <p>
                        Don't have an account? <Link to="/sign-up">Sign up</Link>
                    </p>
                </div>
            </div>
        </>
    );
};

export default Login;
