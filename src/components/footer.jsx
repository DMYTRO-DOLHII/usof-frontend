// src/components/Footer.js
import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-light text-center text-lg-start mt-auto">
            <div className="container p-4">
                <div className="row">
                    <div className="col-lg-6 col-md-12 mb-4">
                        <h5 className="text-uppercase">My App</h5>
                        <p>
                            This is a placeholder footer for My App. You can update this text with
                            any relevant information, like links to documentation, terms of service, or contact details.
                        </p>
                    </div>
                    <div className="col-lg-3 col-md-6 mb-4">
                        <h5 className="text-uppercase">Links</h5>
                        <ul className="list-unstyled mb-0">
                            <li>
                                <a href="#!" className="text-dark">Home</a>
                            </li>
                            <li>
                                <a href="#!" className="text-dark">About</a>
                            </li>
                            <li>
                                <a href="#!" className="text-dark">Contact</a>
                            </li>
                        </ul>
                    </div>
                    <div className="col-lg-3 col-md-6 mb-4">
                        <h5 className="text-uppercase">Follow Us</h5>
                        <ul className="list-unstyled mb-0">
                            <li>
                                <a href="#!" className="text-dark">Twitter</a>
                            </li>
                            <li>
                                <a href="#!" className="text-dark">LinkedIn</a>
                            </li>
                            <li>
                                <a href="#!" className="text-dark">GitHub</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="text-center p-3 bg-dark text-light">
                © 2024 My App: All Rights Reserved.
            </div>
        </footer>
    );
};

export default Footer;
