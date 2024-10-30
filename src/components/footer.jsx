// src/components/Footer.js
import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-dark text-center text-light mt-auto">
            <div className="container p-4">
                <div className="row">
                    <div className="col-lg-6 col-md-12 mb-4">
                        <h5 className="gradient">McOk</h5>
                        <p>
                            This is a placeholder footer for My App. You can update this text with
                            any relevant information, like links to documentation, terms of service, or contact details.
                        </p>
                    </div>
                    <div className="col-lg-3 col-md-6 mb-4">
                        <h5 className="text-uppercase">Links</h5>
                        <ul className="list-unstyled mb-0">
                            <li>
                                <a href="#!" className="text-light">Home</a>
                            </li>
                            <li>
                                <a href="#!" className="text-light">About</a>
                            </li>
                            <li>
                                <a href="#!" className="text-light">Contact</a>
                            </li>
                        </ul>
                    </div>
                    <div className="col-lg-3 col-md-6 mb-4">
                        <h5 className="text-uppercase">Follow Us</h5>
                        <ul className="list-unstyled mb-0">
                            <li>
                                <a href="#!" className="text-light">Twitter</a>
                            </li>
                            <li>
                                <a href="#!" className="text-light">LinkedIn</a>
                            </li>
                            <li>
                                <a href="#!" className="text-light">GitHub</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="text-center p-3 bg-dark text-light">
                © 2024 McOk: All Rights Reserved.
            </div>
        </footer>
    );
};

export default Footer;
