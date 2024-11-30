import React, { useState } from "react";
import Header from "../../components/Header/Header";
import $api from "../../api";

const RequestPasswordReset = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setEmail(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        try {
            const response = await $api.post("/auth/password-reset", { email });

            if (response.status === 200) {
                setMessage("A password reset link has been sent to your email.");
            } else {
                throw new Error(response.data.message);
            }
        } catch (error) {
            if (error.response?.status === 404) {
                // Handle 404 errors specifically
                setError("The email address does not exist in our records.");
            } else {
                // Handle other errors
                setError(error.response?.data?.message || "An error occurred. Please try again.");
            }
        }
    };


    return (
        <>
            <Header hideAuthorizationButtons={true} />
            <div className="container d-flex justify-content-center align-items-center flex-column mt-5" style={{ minHeight: "80vh" }}>
                <div className="card p-4" style={{ width: "100%", maxWidth: "400px" }}>
                    <h2 className="text-center mb-4">Request Password Reset</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group mb-3">
                            <label htmlFor="email">Enter your email</label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                value={email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary w-100">
                            Request Reset Link
                        </button>
                    </form>
                    {message && (
                        <div className="alert alert-success text-center mt-3">
                            {message}
                        </div>
                    )}
                    {error && (
                        <div className="alert alert-danger text-center mt-3">
                            {error}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default RequestPasswordReset;
