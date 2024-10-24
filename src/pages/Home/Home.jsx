import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const Home = () => {
    return (
        <div className="d-flex flex-column min-vh-100">
            <Header />
            {/* Your main content will go here */}
            <div className="container my-5">
                <h1>Welcome to My App</h1>
                <p>Your main content goes here.</p>
            </div>
            <Footer />
        </div>
    );
};

export default Home;