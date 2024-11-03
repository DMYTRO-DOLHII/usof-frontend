import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Header";

const Login = () => {
    const [loginData, setLoginData] = useState({
        login: "",
        password: "",
    });
    const [error, setError] = useState(""); // State to store error message

    const handleChange = (e) => {
        setLoginData({
            ...loginData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(""); // Clear any previous error message

        const url = `${process.env.REACT_APP_BACK_URL}/api/auth/login`;

        fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                login: loginData.login,
                password: loginData.password,
            })
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(data => {
                        throw new Error(data.message); // Use error message from backend
                    });
                }
                return response.json();
            })
            .then(data => {
                // Assuming the token is in `data.token`
                const token = data.token;

                // Save the token in localStorage
                localStorage.setItem('token', token);

                // Redirect to the main page
                window.location.href = '/';
            })
            .catch(error => {
                setError(error.message); // Set the error message to display in UI
            });
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
                        Don't have an account? <Link to="/sign-up">Sign up</Link>
                    </p>
                </div>
            </div>
        </>
    );
};

export default Login;
