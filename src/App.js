import React from 'react';
import './App.css';
import Header from './components/header';
import Footer from './components/footer';

const App = () => {
    return (
        <div className="d-flex flex-column min-vh-100">
            <Header />
            <div className="container my-5">
                <h1>Welcome to My App</h1>
                <p>Your main content goes here.</p>
            </div>
            <Footer />
        </div>
    );
};

export default App;
